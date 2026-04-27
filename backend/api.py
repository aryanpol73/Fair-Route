import os
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# This allows Vercel to talk to Render without any security blocks
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/run-audit', methods=['GET', 'POST'])
def get_audit():
    try:
        # Load the dataset (Make sure this file is in the SAME folder as api.py on GitHub)
        # Using a absolute path to avoid "File Not Found" errors on Render
        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(base_dir, 'pune_delivery_dataset.csv')
        
        if not os.path.exists(csv_path):
            return jsonify({"error": f"CSV file not found at {csv_path}"}), 404

        df = pd.read_csv(csv_path)

        # 1. BEST ZONE CALCULATOR
        df['yield'] = df['weekly_earnings'] / df['tasks_assigned']
        yield_stats = df.groupby('zone')['yield'].mean().sort_values(ascending=False)
        
        best_zone = yield_stats.index[0]
        best_yield = round(yield_stats.iloc[0], 2)
        average_yield = round(df['yield'].mean(), 2)
        
        # 2. SPATIAL DENSITY
        zone_counts = df['zone'].value_counts()
        densities = {
            "89964bc": float(zone_counts.get('Baner', 0)),
            "89964d1": float(zone_counts.get('Kothrud', 0)),
            "89964af": float(zone_counts.get('Hinjewadi', 0)),
            "89964ed": float(zone_counts.get('Zone C', 0))
        }

        # 3. CAUSAL GAP
        worst_zone = yield_stats.index[-1]
        b_avg = df[df['zone'] == best_zone]['weekly_earnings'].mean()
        w_avg = df[df['zone'] == worst_zone]['weekly_earnings'].mean()
        gap = round(abs(b_avg - w_avg), 2)

        # 4. GRAPH TRAJECTORIES (Limiting to 14 weeks)
        fair_path = df[df['zone'] == best_zone].groupby('week')['weekly_earnings'].mean().fillna(0).tolist()[:14]
        biased_path = df[df['zone'] == worst_zone].groupby('week')['weekly_earnings'].mean().fillna(0).tolist()[:14]

        # Return the exact keys the frontend expects
        return jsonify({
            "bias_score": min(round((gap / 20), 1), 100),
            "wage_gap": float(gap),
            "best_zone": str(best_zone),
            "best_yield": float(best_yield),
            "legacy_base_task_value": float(average_yield),
            "fair_path": [round(x, 2) for x in fair_path],
            "biased_path": [round(x, 2) for x in biased_path],
            "densities": densities,
            "compliance": "NON-COMPLIANT" if gap > 450 else "COMPLIANT"
        })

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return jsonify({"error": str(e), "status": "failed"}), 500

if __name__ == "__main__":
    # Render uses Gunicorn, but this is good for local testing
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port)