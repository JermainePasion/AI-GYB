import sys
import json
import glob
import pandas as pd
import numpy as np
import joblib
import os

MAX_COMPONENT_DELTA = 1.5
MIN_SAMPLE_COUNT = 100       
CONFIDENCE_FULL_AT = 600      
DAMPING_FACTOR = 0.6          

FEATURES = ["flex", "gyroY", "gyroZ", "stage"]


if len(sys.argv) < 2:
    print(json.dumps({"error": "No data directory provided"}))
    sys.exit(0)

data_dir = sys.argv[1]

# =========================
# LOAD MODEL + POLICY
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "foundation_rf_model.pkl")
POLICY_PATH = os.path.join(BASE_DIR, "adjustment_policy.json")

model = joblib.load(MODEL_PATH)

with open(POLICY_PATH, "r") as f:
    policy = json.load(f)["policy"]

# =========================
# LOAD USER CSV LOGS
# =========================
files = glob.glob(f"{data_dir}/*.csv")

if not files:
    print(json.dumps({"error": "No CSV files found"}))
    sys.exit(0)

dfs = []

for f in files:
    try:
        temp_df = pd.read_csv(f)

        if temp_df.empty:
            continue

        dfs.append(temp_df)

    except Exception:
        continue

if not dfs:
    print(json.dumps({"error": "No valid CSV data found"}))
    sys.exit(0)

df = pd.concat(dfs, ignore_index=True)
df = df.dropna(subset=FEATURES)

if df.empty or len(df) < MIN_SAMPLE_COUNT:
    print(json.dumps({
        "adjustment": {"flex": 0, "gyroY": 0, "gyroZ": 0},
        "metrics": {
            "avg_pain_risk": 0,
            "max_pain_risk": 0,
            "samples_used": len(df)
        },
        "error": "Insufficient data for adjustment"
    }))
    sys.exit(0)

# =========================
# PAIN RISK PREDICTION
# =========================
X = df[FEATURES].values
pain_risk = model.predict(X)

avg_risk = float(np.mean(pain_risk))
max_risk = float(np.max(pain_risk))

# =========================
# CONFIDENCE SCALING
# =========================
sample_count = len(df)
confidence = min(sample_count / CONFIDENCE_FULL_AT, 1.0)

# =========================
# POLICY-DRIVEN BASE DELTA
# =========================
risk_delta = avg_risk - policy["target_risk"]

direction_multiplier = (
    policy["tighten_multiplier"]
    if risk_delta > 0
    else policy["relax_multiplier"]
)

raw_delta = risk_delta * policy["base_step"] * direction_multiplier

# Apply damping and confidence scaling
raw_delta = raw_delta * DAMPING_FACTOR * confidence

# =========================
# PAIN LOCATION WEIGHTING
# =========================
location_weights = {
    "flex": 1.0,
    "gyroY": 1.0,
    "gyroZ": 1.0
}

if "painX" in df.columns and "painY" in df.columns:
    pain_points = df[(df["painX"] != 0) | (df["painY"] != 0)]

    if not pain_points.empty:
        avg_x = pain_points["painX"].mean()
        avg_y = pain_points["painY"].mean()

        norm_x = avg_x / 500.0
        norm_y = avg_y / 500.0

        if norm_y < -0.3:
            location_weights["flex"] += 0.4

        if norm_y > 0.3:
            location_weights["gyroY"] += 0.4

        if abs(norm_x) > 0.3:
            location_weights["gyroZ"] += 0.4


flex_delta = float(np.clip(
    raw_delta * location_weights["flex"],
    -MAX_COMPONENT_DELTA,
    MAX_COMPONENT_DELTA
))

gyroY_delta = float(np.clip(
    raw_delta * location_weights["gyroY"],
    -MAX_COMPONENT_DELTA,
    MAX_COMPONENT_DELTA
))

gyroZ_delta = float(np.clip(
    raw_delta * location_weights["gyroZ"],
    -MAX_COMPONENT_DELTA,
    MAX_COMPONENT_DELTA
))

result = {
    "adjustment": {
        "flex": round(flex_delta, 4),
        "gyroY": round(gyroY_delta, 4),
        "gyroZ": round(gyroZ_delta, 4)
    },
    "metrics": {
        "avg_pain_risk": round(avg_risk, 4),
        "max_pain_risk": round(max_risk, 4),
        "samples_used": sample_count,
        "confidence": round(confidence, 4)
    }
}

print(json.dumps(result))