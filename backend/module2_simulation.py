import pandas as pd
import numpy as np
import json

def run_s2_simulation():
    df = pd.read_csv('./pune_delivery_dataset.csv')
    
    # Extract actual paths from data
    biased_real = df[df['zone'] == 'Kothrud'].groupby('week')['weekly_earnings'].mean().values
    fair_real = df[df['zone'] == 'Baner'].groupby('week')['weekly_earnings'].mean().values
    
    # Predict Weeks 13-24 using deterministic decay/growth
    b_proj = [biased_real[-1] * (0.975**i) for i in range(1, 13)]
    f_proj = [fair_real[-1] * (1.003**i) for i in range(1, 13)]
    
    full_b = np.concatenate([biased_real, b_proj])
    full_f = np.concatenate([fair_real, f_proj])
    
    # Find the 'Trap Week' (Earnings drop < 70% of fair path)
    trap_week = next((i+1 for i in range(24) if full_b[i] < full_f[i]*0.7), 24)

    result = {
        "biased_path": [round(float(x), 2) for x in full_b],
        "fair_path": [round(float(x), 2) for x in full_f],
        "poverty_trap_week": int(trap_week)
    }
    with open('module2_output.json', 'w') as f:
        json.dump(result, f)