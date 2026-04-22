from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
import logging

# Import the 4 custom modules
import module1_causal as m1
import module2_simulation as m2
import module3_intersectional as m3
import module4_anomaly as m4

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes to support Next.js/Frontend integration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check for deployment monitoring."""
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()}), 200

@app.route('/sample', methods=['GET'])
def get_sample_data():
    """Generates and returns sample worker data using the Intersectional module's generator."""
    try:
        sample_df = m3.generate_sample_data()
        # Convert DataFrame to list of dicts for JSON response
        return jsonify(sample_df.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Main orchestration endpoint.
    Processes worker data through the 4-stage bias detection pipeline.
    """
    try:
        content = request.json
        if not content or 'worker_data' not in content:
            return jsonify({"error": "Missing 'worker_data' in request body"}), 400
        
        # Convert input list to DataFrame
        df = pd.DataFrame(content['worker_data'])
        
        # --- Stage 1: Causal Analysis ---
        # Isolates structural bias from performance factors
        causal_results = m1.run_causal_analysis(df)
        
        # --- Stage 2: Long-term Simulation ---
        # We use the detected structural_bias_score to predict the 12-week poverty trap
        # Divide by 100 to convert percentage to decimal bias_factor
        sim_bias_factor = causal_results['structural_bias_score'] / 100
        simulation_results = m2.simulate_feedback_loop(bias_factor=sim_bias_factor)
        
        # --- Stage 3: Intersectional Bias ---
        # Looks for hidden disparities in specific subgroups (Zone + Shift)
        intersectional_results = m3.detect_intersectional_bias(df)
        
        # --- Stage 4: Anomaly & Shadow Ban Detection ---
        # Treats the current dataset as a window of history to find algorithmic penalties
        anomaly_results = m4.detect_anomalies(df)

        # --- Calculation: Overall Fairness Score ---
        # Weighted average of the three primary bias dimensions
        # 0 = Totally Biased, 100 = Perfectly Fair
        c_score = causal_results['structural_bias_score']      # (Weight: 40%)
        i_score = intersectional_results['overall_intersectional_score'] # (Weight: 35%)
        a_score = anomaly_results['shadow_ban_probability']    # (Weight: 25%)
        
        weighted_bias = (c_score * 0.40) + (i_score * 0.35) + (a_score * 0.25)
        overall_fairness_score = max(0, round(100 - weighted_bias, 2))

        # --- Aggregating Final Response ---
        response = {
            "causal": causal_results,
            "simulation": simulation_results,
            "intersectional": {
                "high_risk_subgroups": intersectional_results['high_risk_subgroups'],
                "overall_intersectional_score": intersectional_results['overall_intersectional_score'],
                "worst_subgroup": intersectional_results['worst_subgroup']
            },
            "anomaly": {
                "penalty_count": anomaly_results['penalty_count'],
                "shadow_ban_probability": anomaly_results['shadow_ban_probability'],
                "worker_verdict": anomaly_results['worker_verdict'],
                "algorithmic_penalties": anomaly_results['algorithmic_penalties']
            },
            "overall_fairness_score": overall_fairness_score,
            "timestamp": datetime.utcnow().isoformat()
        }

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == "__main__":
    # Senior ML Engineer Note:
    # This API serves as the backbone for the Google Solution Challenge prototype,
    # bridging complex causal models and anomaly detection with a usable REST interface.
    print("🚀 GigFairness Detection API is running on http://localhost:8000")
    app.run(host="0.0.0.0", port=8000, debug=True)