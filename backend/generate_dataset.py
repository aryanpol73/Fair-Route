import pandas as pd
import numpy as np

# Seed for reproducible patterns with realistic noise
np.random.seed(42)

def generate_pune_data():
    zones = {
        "Baner": "89964bc", 
        "Hinjewadi": "89964af", 
        "Viman Nagar": "89964ed", 
        "Kothrud": "89964d1", # TARGET BIASED ZONE
        "Hadapsar": "89964fe"
    }
    names = ["Rahul", "Amit", "Priya", "Sneha", "Vikram", "Anjali", "Suresh", "Kavita", "Rohan", "Deepak"]
    
    data = []
    for i in range(100):
        w_id = f"PNQ-{1000 + i}"
        name = f"{np.random.choice(names)} {chr(65 + (i % 26))}"
        zone = np.random.choice(list(zones.keys()))
        s2_token = zones[zone]
        shift = np.random.choice(["Day", "Night"])
        
        # Professional Gig Metrics
        tenure = np.random.randint(1, 48)
        rating = round(np.random.beta(7, 2) * 2 + 3, 1) # High-skewed ratings
        rating = min(rating, 5.0)

        for week in range(1, 13):
            # Base logic: Tasks are a function of rating + random demand
            base_tasks = np.random.normal(48, 6) + (rating * 1.5)
            base_val = np.random.uniform(105, 135)
            
            # SYSTEMIC BIAS INJECTION (The Audit Target)
            bias_multiplier = 1.0
            shadow_ban = 0
            if zone == "Kothrud":
                # Structural suppression of earnings (20% average)
                bias_multiplier = np.random.uniform(0.75, 0.82)
                # Algorithmic "Shadow Banning" for Night Shifts
                if shift == "Night" and np.random.random() < 0.12:
                    base_tasks *= np.random.uniform(0.2, 0.4)
                    shadow_ban = 1

            earnings = max(round(base_tasks * base_val * bias_multiplier, 2), 200.0)
            
            data.append({
                "worker_id": w_id, "worker_name": name, "zone": zone,
                "s2_token": s2_token, "shift_type": shift, "rating": rating,
                "tenure_months": tenure, "week": week,
                "tasks_assigned": int(base_tasks), "weekly_earnings": earnings,
                "shadow_ban_flag": shadow_ban
            })

    df = pd.DataFrame(data)
    df.to_csv('pune_delivery_dataset.csv', index=False)
    print("SUCCESS: Randomized Pune Dataset Generated.")

if __name__ == "__main__":
    generate_pune_data()