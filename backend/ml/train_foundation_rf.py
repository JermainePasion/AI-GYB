import pandas as pd
import numpy as np
import joblib
import json
import glob
from sklearn.ensemble import RandomForestRegressor

# =========================
# CONFIG
# =========================
DATA_DIR = "data/*.csv"
PAIN_EXPAND_SECONDS = 5
RANDOM_STATE = 42

# =========================
# LOAD CSV DATA
# =========================
files = glob.glob(DATA_DIR)
assert files, "No CSV files found"

dfs = []
for f in files:
    df = pd.read_csv(f)
    dfs.append(df)

df = pd.concat(dfs, ignore_index=True)

print(f"Loaded {len(df)} rows from {len(files)} CSV files")

# =========================
# CLEAN DATA
# =========================
df = df.dropna(subset=["flex", "gyroY", "gyroZ", "stage"])
df = df.reset_index(drop=True)

# =========================
# PAIN LABELING
# =========================
df["pain"] = ((df["painX"] != 0) | (df["painY"] != 0)).astype(int)

for idx in df[df["pain"] == 1].index:
    start = max(0, idx - PAIN_EXPAND_SECONDS)
    df.loc[start:idx, "pain"] = 1

pain_rate = float(df["pain"].mean())
print("Pain rate:", pain_rate)

# =========================
# FEATURE MATRIX
# =========================
FEATURES = ["flex", "gyroY", "gyroZ", "stage"]
X = df[FEATURES].values
y = df["pain"].values

# =========================
# TRAIN RANDOM FOREST
# =========================
model = RandomForestRegressor(
    n_estimators=150,
    max_depth=8,
    min_samples_leaf=50,
    random_state=RANDOM_STATE,
    n_jobs=-1
)

model.fit(X, y)
print("Model training complete")

# =========================
# RISK DISTRIBUTION
# =========================
df["pain_risk"] = model.predict(X)
risk_mean = float(df["pain_risk"].mean())
risk_std = float(df["pain_risk"].std())

print("Pain risk mean:", risk_mean)
print("Pain risk std:", risk_std)

# =========================
# FEATURE IMPORTANCE (NEW)
# =========================
importances = model.feature_importances_

feature_importance = dict(zip(FEATURES, importances))

# Normalize only sensor features (exclude stage)
sensor_total = feature_importance["flex"] + \
               feature_importance["gyroY"] + \
               feature_importance["gyroZ"]

sensor_weights = {
    "flex": float(feature_importance["flex"] / sensor_total),
    "gyroY": float(feature_importance["gyroY"] / sensor_total),
    "gyroZ": float(feature_importance["gyroZ"] / sensor_total)
}

print("Sensor importance weights:")
print(json.dumps(sensor_weights, indent=2))

# =========================
# CONFIDENCE CALIBRATION
# =========================
confidence_calibration = {
    "min_samples_for_full_confidence": 600,
    "max_risk_std": 0.2,
    "strong_signal_delta": 0.5,
    "weights": {
        "volume": 0.4,
        "consistency": 0.3,
        "signal": 0.3
    }
}

# =========================
# POLICY PARAMETER DERIVATION
# =========================
base_step = float(np.clip(1.5 * pain_rate * 10, 0.5, 2.0))
max_step = float(base_step * 2)

tighten_multiplier = float(np.clip(1 + risk_std * 10, 1.2, 2.0))
relax_multiplier = float(np.clip(1 - pain_rate, 0.6, 0.9))

policy = {
    "base_step": base_step,
    "max_step": max_step,
    "tighten_multiplier": tighten_multiplier,
    "relax_multiplier": relax_multiplier,
    "target_risk": 0.50,
    "sensor_weights": sensor_weights  # NEW
}

risk_profile = {
    "pain_rate": pain_rate,
    "risk_mean": risk_mean,
    "risk_std": risk_std,
    "feature_importance": feature_importance
}

print("Learned adjustment policy:")
print(json.dumps(policy, indent=2))

# =========================
# SAVE ARTIFACTS
# =========================
joblib.dump(model, "foundation_rf_model.pkl")

with open("adjustment_policy.json", "w") as f:
    json.dump({
        "policy": policy,
        "risk_profile": risk_profile,
        "confidence_calibration": confidence_calibration
    }, f, indent=2)

print("Artifacts saved:")
print("- foundation_rf_model.pkl")
print("- adjustment_policy.json")