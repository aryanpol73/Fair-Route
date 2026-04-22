"""
FairRoute — Biased Gig Market Dataset Generator
================================================
Run this file in VS Code to generate: fairroute_biased_logs.csv

Install dependencies first:
    pip install pandas numpy

Then run:
    python generate_dataset.py

What this script does:
-----------------------
It simulates a gig platform with 100 workers across 3 zones over 12 weeks.
Zone C workers receive a hidden 30% pay penalty injected at the algorithmic level —
even though their ratings are identical to Zone A/B workers. This models real-world
algorithmic discrimination based on geography (zip code bias).

Three bias mechanisms are baked in:
  1. STRUCTURAL BIAS   — Zone C workers get 30% lower base task_value
  2. INTERSECTIONAL    — Zone C + Night Shift get an extra 12% penalty (overlapping disadvantage)
  3. FEEDBACK LOOP     — Low earnings → reduced acceptance rate → algorithm justifies lower pay
  4. SHADOW BAN EVENTS — 3 artificial penalty weeks injected for select Zone C workers

Output columns:
  worker_id, zone, shift_type, rating, tenure, week,
  acceptance_rate, task_value, weekly_earnings, shadow_ban_flag
"""

import pandas as pd
import numpy as np


def simulate_gig_market(n_workers: int = 100, weeks: int = 12) -> pd.DataFrame:
    """
    Simulate a biased gig marketplace.

    Args:
        n_workers: Number of unique workers to simulate (default 100)
        weeks: Number of weeks to simulate per worker (default 12)

    Returns:
        DataFrame with n_workers * weeks rows
    """
    np.random.seed(42)
    data = []

    # --- 1. Initialize Workers ---
    worker_ids = [f"WRK-{i:03d}" for i in range(n_workers)]

    # Zone distribution: 30% A, 40% B, 30% C
    zones = np.random.choice(
        ["Zone A", "Zone B", "Zone C"],
        size=n_workers,
        p=[0.30, 0.40, 0.30]
    )

    # Shift assignment: Zone C workers are skewed 75% toward Night shifts
    shift_types = np.random.choice(["Day", "Night"], size=n_workers, p=[0.60, 0.40])
    for i in range(n_workers):
        if zones[i] == "Zone C":
            shift_types[i] = np.random.choice(["Day", "Night"], p=[0.25, 0.75])

    # All workers start with high ratings (4.4–4.9) to PROVE bias is not merit-based
    base_ratings = np.random.uniform(4.4, 4.9, size=n_workers)

    # Tenure: 4 to 52 weeks of experience
    tenures = np.random.randint(4, 53, size=n_workers)

    # --- 2. Simulate Each Worker × Week ---
    for w_idx in range(n_workers):
        current_acceptance_rate = 0.95  # All workers start equal

        for week in range(1, weeks + 1):

            # --- BIAS INJECTION 1: Structural Zone Penalty ---
            # Zone C workers receive 30% less base pay regardless of performance
            bias_multiplier = 0.70 if zones[w_idx] == "Zone C" else 1.0

            # --- BIAS INJECTION 2: Intersectional Penalty ---
            # Zone C + Night shift gets an additional 12% cut (overlapping disadvantage)
            if zones[w_idx] == "Zone C" and shift_types[w_idx] == "Night":
                bias_multiplier *= 0.88

            # --- MERITOCRACY LAYER (overridden by bias above) ---
            base_value = np.random.uniform(100, 150)
            task_value = base_value * bias_multiplier * (base_ratings[w_idx] / 5.0)

            # --- BIAS INJECTION 3: Feedback Loop ---
            # Low earnings increase worker fatigue, dropping acceptance rate
            # The algorithm then uses this low rate to justify further pay cuts
            if task_value < 95:
                current_acceptance_rate = max(
                    current_acceptance_rate - 0.02,  # Morale drops 2% per week
                    0.30  # Floor: workers won't quit entirely
                )

            final_allocation = round(task_value * current_acceptance_rate, 2)

            # Weekly earnings = task_value × number of tasks completed (3–7 tasks/week)
            tasks_completed = np.random.randint(3, 8)
            weekly_earnings = round(final_allocation * tasks_completed, 2)

            # Selection rate derived from acceptance rate with noise
            selection_rate = round(
                min(current_acceptance_rate + np.random.uniform(-0.05, 0.05), 1.0), 3
            )

            # --- BIAS INJECTION 4: Shadow Ban Events ---
            # Weeks 9–11: select Zone C workers get a 55% earnings cut
            # Their rating stays the same — proving it's algorithmic, not performance-based
            shadow_ban_flag = 0
            if zones[w_idx] == "Zone C" and week in [9, 10, 11] and w_idx % 7 == 0:
                weekly_earnings = round(weekly_earnings * 0.45, 2)
                shadow_ban_flag = 1

            data.append({
                "worker_id": worker_ids[w_idx],
                "zone": zones[w_idx],
                "shift_type": shift_types[w_idx],
                "rating": round(base_ratings[w_idx], 2),
                "tenure": int(tenures[w_idx]),
                "week": week,
                "acceptance_rate": round(current_acceptance_rate, 3),
                "selection_rate": selection_rate,
                "task_value": final_allocation,
                "weekly_earnings": weekly_earnings,
                "shadow_ban_flag": shadow_ban_flag,
            })

    return pd.DataFrame(data)


def print_bias_verification(df: pd.DataFrame) -> None:
    """Print a summary table to verify bias is statistically clear."""
    print("\n" + "=" * 55)
    print("  FAIRROUTE — BIAS VERIFICATION REPORT")
    print("=" * 55)

    zone_summary = df.groupby("zone").agg(
        avg_task_value=("task_value", "mean"),
        avg_weekly_earnings=("weekly_earnings", "mean"),
        avg_acceptance_rate=("acceptance_rate", "mean"),
        avg_rating=("rating", "mean"),
        unique_workers=("worker_id", "nunique"),
    ).round(2)
    print("\n📊 BY ZONE:")
    print(zone_summary.to_string())

    intersectional = df.groupby(["zone", "shift_type"]).agg(
        avg_weekly_earnings=("weekly_earnings", "mean"),
        workers=("worker_id", "nunique"),
    ).round(2)
    print("\n🔍 INTERSECTIONAL BREAKDOWN (Zone × Shift):")
    print(intersectional.to_string())

    zone_a_avg = zone_summary.loc["Zone A", "avg_weekly_earnings"]
    zone_c_avg = zone_summary.loc["Zone C", "avg_weekly_earnings"]
    gap = zone_a_avg - zone_c_avg
    pct = (gap / zone_a_avg) * 100

    print(f"\n⚠️  PROVEN BIAS:")
    print(f"   Zone A avg earnings : ${zone_a_avg:.2f}/week")
    print(f"   Zone C avg earnings : ${zone_c_avg:.2f}/week")
    print(f"   Wage gap            : ${gap:.2f}/week ({pct:.1f}% less)")
    print(f"   Yet avg ratings are nearly identical across zones!")
    print(f"   → Bias is structural, not merit-based ✓")

    shadow_bans = df[df["shadow_ban_flag"] == 1]
    print(f"\n🚨 SHADOW BAN EVENTS DETECTED: {len(shadow_bans)} penalty weeks")
    print("=" * 55 + "\n")


if __name__ == "__main__":
    print("🔄 Generating FairRoute biased dataset...")

    df = simulate_gig_market(n_workers=100, weeks=12)

    output_path = "fairroute_biased_logs.csv"
    df.to_csv(output_path, index=False)

    print(f"✅ Dataset saved: {output_path}")
    print(f"   Rows: {len(df):,}  |  Workers: 100  |  Weeks: 12")

    print_bias_verification(df)

    print("🚀 Next steps:")
    print("   1. Feed this CSV into module1_causal.py")
    print("   2. Feed into module3_intersectional.py")
    print("   3. Use worker WRK-000 history for module4_anomaly.py")
    print("   4. Start Flask API: python api.py")
