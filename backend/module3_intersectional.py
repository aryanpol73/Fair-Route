import pandas as pd
import numpy as np
import json

def generate_sample_data() -> pd.DataFrame:
    """
    Generates a synthetic dataset of 80 workers to test intersectional bias.
    Designed to showcase how specific combinations of features (Zone + Shift)
    can hide bias that might be missed in aggregate.
    """
    np.random.seed(42)
    n_workers = 80
    
    # Core attributes
    zones = np.random.choice(['A', 'B', 'C'], size=n_workers)
    shifts = np.random.choice(['Day', 'Night'], size=n_workers)
    worker_ids = [f"ID-{i:03d}" for i in range(n_workers)]
    
    data = []
    for i in range(n_workers):
        z, s = zones[i], shifts[i]
        
        # Default distributions
        base_val = 100.0
        base_sel = 0.85
        
        # Inject intersectional bias: Zone C + Night Shift is significantly penalized
        if z == 'C' and s == 'Night':
            base_val *= 0.65  # 35% reduction
            base_sel *= 0.70  # 30% reduction
        # Minor bias for Zone B Day
        elif z == 'B' and s == 'Day':
            base_val *= 0.90
            
        task_value = np.random.normal(base_val, 5)
        selection_rate = np.clip(np.random.normal(base_sel, 0.05), 0, 1)
        
        data.append({
            "worker_id": worker_ids[i],
            "zone": z,
            "shift_type": s,
            "task_value": task_value,
            "selection_rate": selection_rate
        })
        
    return pd.DataFrame(data)

def detect_intersectional_bias(df: pd.DataFrame) -> dict:
    """
    Detects fairness issues at the intersection of geographical zone and shift type.
    
    Intersectional bias is critical because a system might appear fair 'on average'
    for all Zones or all Shifts, but severely disadvantage a specific subgroup 
    (e.g., Night workers in Zone C).
    """
    # 1. Calculate Global Averages for comparison
    global_avg_task = df['task_value'].mean()
    global_avg_selection = df['selection_rate'].mean()
    
    # 2. Group by intersectional features
    grouped = df.groupby(['zone', 'shift_type']).agg(
        mean_task_value=('task_value', 'mean'),
        mean_selection_rate=('selection_rate', 'mean'),
        worker_count=('worker_id', 'count')
    ).reset_index()
    
    subgroups_list = []
    high_risk_subgroups = []
    
    # 3. Analyze each subgroup
    for _, row in grouped.iterrows():
        # Calculate disparity scores (Percentage below global average)
        # Formula: $$Disparity = \frac{GlobalAvg - SubgroupAvg}{GlobalAvg} \times 100$$
        disp_task = (global_avg_task - row['mean_task_value']) / global_avg_task * 100
        disp_sel = (global_avg_selection - row['mean_selection_rate']) / global_avg_selection * 100
        
        # The final disparity_score is the maximum of the two deficits
        disparity_score = max(0, disp_task, disp_sel)
        
        # 4. Flag Risk Levels
        # Bias threshold: 20% deficit (Industry standard '80% rule' logic)
        is_high_risk = (row['mean_task_value'] < global_avg_task * 0.80) or \
                       (row['mean_selection_rate'] < global_avg_selection * 0.80)
        
        risk_level = "HIGH_RISK" if is_high_risk else "LOW_RISK"
        
        subgroup_data = {
            "zone": row['zone'],
            "shift_type": row['shift_type'],
            "mean_task_value": round(row['mean_task_value'], 2),
            "mean_selection_rate": round(row['mean_selection_rate'], 3),
            "disparity_score": round(disparity_score, 2),
            "risk_level": risk_level,
            "worker_count": int(row['worker_count'])
        }
        
        subgroups_list.append(subgroup_data)
        if is_high_risk:
            high_risk_subgroups.append(subgroup_data)
            
    # 5. Determine Overall Score and Worst Subgroup
    worst_subgroup = max(subgroups_list, key=lambda x: x['disparity_score'])
    
    # Overall score is a weighted average of disparity by worker count
    total_workers = df.shape[0]
    weighted_score = sum(s['disparity_score'] * s['worker_count'] for s in subgroups_list) / total_workers
    
    return {
        "subgroups": subgroups_list,
        "high_risk_subgroups": high_risk_subgroups,
        "worst_subgroup": worst_subgroup,
        "overall_intersectional_score": round(weighted_score, 2)
    }

if __name__ == "__main__":
    # Engineering Note: We focus on intersectionality to prevent "Simpson's Paradox" 
    # where bias is obscured by aggregation.
    
    df_workers = generate_sample_data()
    bias_results = detect_intersectional_bias(df_workers)
    
    # Print formatted JSON for the prototype dashboard
    print(json.dumps(bias_results, indent=4))