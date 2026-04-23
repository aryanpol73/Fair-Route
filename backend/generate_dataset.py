import pandas as pd
import numpy as np

def generate_longitudinal_data():
    workers = 100
    weeks = 12
    data = []
    
    for w_id in range(workers):
        zone = np.random.choice(['Zone A', 'Zone B', 'Zone C'], p=[0.3, 0.4, 0.3])
        shift = "Night" if zone == "Zone C" else np.random.choice(["Day", "Night"])
        rating = round(np.random.uniform(4.2, 4.9), 2)
        
        for week in range(1, weeks + 1):
            # Bias Injection: Zone C earns 35% less base
            base = np.random.uniform(400, 500)
            bias = 0.65 if zone == "Zone C" else (0.85 if zone == "Zone B" else 1.0)
            
            # The "Zara K." Trap: Zone C Night Shift gets an extra 10% penalty
            if zone == "Zone C" and shift == "Night":
                bias *= 0.90
            
            task_val = round(base * bias * (rating/5), 2)
            sel_rate = round(np.random.normal(0.88 if zone == "Zone A" else 0.62, 0.05), 2)
            
            data.append({
                "worker_id": f"WRK-{w_id:03d}",
                "zone": zone,
                "shift_type": shift,
                "week": week,
                "rating": rating,
                "task_frequency": task_val,
                "acceptance_rate": np.clip(sel_rate, 0.3, 1.0)
            })
            
    df = pd.DataFrame(data)
    df.to_csv('backend/gig_worker_bias_demo.csv', index=False)
    print("✅ Premium 12-Week Dataset Generated (1,200 rows)")

generate_longitudinal_data()