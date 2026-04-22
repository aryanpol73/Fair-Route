import numpy as np
import json

def simulate_feedback_loop(weeks=12, bias_factor=0.20, fatigue_rate=0.02) -> dict:
    """
    Simulates the long-term impact of algorithmic bias on gig worker engagement.
    
    WHY THIS MATTERS FOR ALGORITHMIC JUSTICE:
    In gig platforms, bias isn't static; it's a feedback loop. When a system 
    undervalues a worker's tasks (the 'biased_zone'), the worker often experiences 
    reduced motivation or 'fatigue', leading to lower acceptance rates. Many 
    algorithms interpret this drop in engagement as a lack of quality or reliability, 
    further reducing the worker's opportunities. 
    
    This simulation demonstrates the 'Poverty Trap'—a point of no return where 
    structural bias and the resulting behavioral changes decouple a worker's 
    earning potential from their actual skill or effort.
    """
    
    # Initial state
    base_value = 500.0
    starting_acceptance = 0.95
    
    # State tracking for Biased Cohort
    biased_acc_rate = starting_acceptance
    biased_weekly_earnings = []
    
    # State tracking for Fair Cohort
    fair_acc_rate = starting_acceptance
    fair_weekly_earnings = []
    
    poverty_trap_week = None
    
    for week in range(1, weeks + 1):
        # 1. Fair Cohort Calculation (Baseline)
        fair_task_value = base_value
        fair_earning = fair_task_value * fair_acc_rate
        fair_weekly_earnings.append(round(fair_earning, 2))
        
        # 2. Biased Cohort Calculation
        # Task value is immediately hit by the bias factor
        biased_task_value = base_value * (1 - bias_factor)
        
        # Current week earnings based on current acceptance rate
        biased_earning = biased_task_value * biased_acc_rate
        biased_weekly_earnings.append(round(biased_earning, 2))
        
        # 3. Poverty Trap Check (biased earnings < 60% of fair earnings)
        if poverty_trap_week is None and (biased_earning < 0.60 * fair_earning):
            poverty_trap_week = week
            
        # 4. Update for Next Week: Engagement fatigue
        # Workers in biased zones see lower returns, leading to lower acceptance rates
        biased_acc_rate = max(0.3, biased_acc_rate - fatigue_rate)
        # Fair cohort remains stable in this model
        
    # Calculate cumulative loss
    cumulative_loss = np.sum(fair_weekly_earnings) - np.sum(biased_weekly_earnings)
    
    return {
        "biased_earnings": biased_weekly_earnings,
        "fair_earnings": fair_weekly_earnings,
        "cumulative_loss": round(float(cumulative_loss), 2),
        "poverty_trap_week": poverty_trap_week,
        "week_labels": [f"Week {i}" for i in range(1, weeks + 1)]
    }

if __name__ == "__main__":
    # Simulate the default 12-week scenario
    simulation_results = simulate_feedback_loop(
        weeks=12, 
        bias_factor=0.25, # 25% lower task value
        fatigue_rate=0.03  # 3% drop in acceptance per week
    )
    
    # Print results as formatted JSON for integration/demonstration
    print(json.dumps(simulation_results, indent=4))