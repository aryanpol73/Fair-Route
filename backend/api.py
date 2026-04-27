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

        # FEATURE 1: BEST ZONE CALCULATOR
        # We find the zone where (Earnings / Tasks) is highest
        df['yield'] = df['weekly_earnings'] / df['tasks_assigned']
        yield_stats = df.groupby('zone')['yield'].mean().sort_values(ascending=False)
        
        best_zone = yield_stats.index[0]
        best_yield = round(yield_stats.iloc[0], 2)
        
        # We also calculate the overall average yield to show as the "legacy" base value
        average_yield = round(df['yield'].mean(), 2)
        
        # FEATURE 2: SPATIAL DENSITY (For S2 Cell Visuals)
        # Using pure dataset values, removing all random/hardcoded numbers
        zone_counts = df['zone'].value_counts()
        densities = {
            "89964bc": float(zone_counts.get('Baner', 0)),
            "89964d1": float(zone_counts.get('Kothrud', 0)),
            "89964af": float(zone_counts.get('Hinjewadi', 0)),
            "89964ed": float(zone_counts.get('Zone C', 0)) # Or whichever your 4th zone is
        }

        # FEATURE 3: CAUSAL GAP (Best Zone vs Worst Zone)
        # To make it dynamic, we use the highest yielding zone and lowest yielding zone
        worst_zone = yield_stats.index[-1]
        
        b_avg = df[df['zone'] == best_zone]['weekly_earnings'].mean()
        w_avg = df[df['zone'] == worst_zone]['weekly_earnings'].mean()
        
        # The true mathematical gap
        gap = round(abs(b_avg - w_avg), 2)

        # FEATURE 4: GRAPH TRAJECTORIES (Up to 14 weeks)
        # Replaces NaN with 0 so the graph doesn't break
        fair_path = df[df['zone'] == best_zone].groupby('week')['weekly_earnings'].mean().fillna(0).tolist()[:14]
        biased_path = df[df['zone'] == worst_zone].groupby('week')['weekly_earnings'].mean().fillna(0).tolist()[:14]

        # Final JSON Payload sent to Next.js UI
        return jsonify({
            "bias_score": min(round((gap / 20), 1), 100), # Scales the gap to a 0-100 score
            "wage_gap": float(gap),
            "best_zone": best_zone,
            "best_yield": float(best_yield),
            "legacy_base_task_value": float(average_yield), # Required by UI Comparison Component
            "fair_path": [round(x, 2) for x in fair_path], # Rounds lists for clean graph
            "biased_path": [round(x, 2) for x in biased_path],
            "densities": densities,
            "compliance": "NON-COMPLIANT" if gap > 450 else "COMPLIANT"
        })

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)