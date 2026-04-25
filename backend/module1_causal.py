import pandas as pd
import numpy as np
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/audit-dashboard', methods=['GET'])
def get_audit():
    try:
        df = pd.read_csv('./pune_delivery_dataset.csv')

        # FEATURE 1.1: CAUSAL INFERENCE (Manual ATE)
        # We control for rating to find the "Pure Spatial Effect"
        # Logic: (Mean Earnings in Baner at Rating X) - (Mean Earnings in Kothrud at Rating X)
        df['rating_bin'] = pd.cut(df['rating'], bins=[0, 3, 4, 5])
        stratified_gap = df.groupby(['rating_bin', 'zone'])['weekly_earnings'].mean().unstack()
        
        # This is the real "Causal Gap" independent of how good the worker is
        causal_gap = (stratified_gap['Baner'] - stratified_gap['Kothrud']).mean()
        
        # FEATURE 1.3: COUNTERFACTUAL (The "What-If")
        # If a Kothrud worker moved to Baner, they gain the Causal Gap
        counterfactual_gain = round(causal_gap, 2)

        # FEATURE 1.4: FEEDBACK LOOP
        weekly_trend = df.groupby(['week', 'zone'])['weekly_earnings'].mean().unstack()
        fair_path = weekly_trend['Baner'].fillna(method='ffill').tolist()[:12]
        biased_path = weekly_trend['Kothrud'].fillna(method='ffill').tolist()[:12]

        return jsonify({
            "bias_score": min(round((causal_gap / 15) * 10, 1), 100),
            "wage_gap": float(round(causal_gap, 2)),
            "counterfactual": float(counterfactual_gain),
            "fair_path": fair_path,
            "biased_path": biased_path,
            "compliance": "NON-COMPLIANT" if causal_gap > 400 else "COMPLIANT"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500