import pandas as pd
import json

def run_intersectional_audit():
    df = pd.read_csv('./pune_delivery_dataset.csv')
    df['subgroup'] = df['zone'] + " + " + df['shift_type']
    
    avg_earnings = df['weekly_earnings'].mean()
    stats = df.groupby('subgroup')['weekly_earnings'].mean().reset_index()
    
    # Flag if subgroup earnings are < 85% of city average
    flagged = stats[stats['weekly_earnings'] < (avg_earnings * 0.85)]['subgroup'].tolist()
    matrix = df.groupby(['zone', 'shift_type'])['weekly_earnings'].mean().unstack().fillna(0).to_dict(orient='index')

    result = {
        "flagged_subgroups": flagged,
        "global_mean": round(float(avg_earnings), 2),
        "matrix": matrix
    }
    with open('module3_output.json', 'w') as f:
        json.dump(result, f)