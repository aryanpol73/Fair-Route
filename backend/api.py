import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/audit-dashboard', methods=['GET'])
def get_audit():
    try:
        # Load real Pune dataset
        df = pd.read_csv('./pune_delivery_dataset.csv')

        # FEATURE: BEST ZONE CALCULATOR
        # We find the zone where (Earnings / Tasks) is highest
        df['yield'] = df['weekly_earnings'] / df['tasks_assigned']
        yield_stats = df.groupby('zone')['yield'].mean().sort_values(ascending=False)
        
        best_zone = yield_stats.index[0]
        best_yield = round(yield_stats.iloc[0], 2)
        
        # FEATURE: SPATIAL DENSITY (For Heatmap)
        zone_counts = df['zone'].value_counts()
        densities = {
            "89964bc": float(zone_counts.get('Baner', 0)),
            "89964d1": float(zone_counts.get('Kothrud', 0)),
            "89964af": 15.0,
            "89964ed": 10.0
        }

        # CAUSAL GAP (Baner vs Kothrud)
        k_avg = df[df['zone'] == 'Kothrud']['weekly_earnings'].mean()
        b_avg = df[df['zone'] == 'Baner']['weekly_earnings'].mean()
        gap = round(abs(b_avg - k_avg), 2)

        return jsonify({
            "bias_score": min(round((gap / 20), 1), 100),
            "wage_gap": float(gap),
            "best_zone": best_zone,
            "best_yield": float(best_yield),
            "fair_path": df[df['zone'] == 'Baner'].groupby('week')['weekly_earnings'].mean().tolist()[:12],
            "biased_path": df[df['zone'] == 'Kothrud'].groupby('week')['weekly_earnings'].mean().tolist()[:12],
            "densities": densities,
            "compliance": "NON-COMPLIANT" if gap > 450 else "COMPLIANT"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)