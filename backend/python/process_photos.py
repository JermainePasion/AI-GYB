import sys, os, json, math, cv2, base64
import mediapipe as mp
import numpy as np
import mediapipe.python.solutions.drawing_utils as mp_drawing

# ---------------------------
# CONFIG
# ---------------------------
drawing_spec_landmarks = mp_drawing.DrawingSpec(
    color=(217,204,164), thickness=4, circle_radius=3
)
drawing_spec_connections = mp_drawing.DrawingSpec(
    color=(255, 0, 0), thickness=3
)

output_dir = sys.argv[1]
image_paths = sys.argv[2:]

mp_pose = mp.solutions.pose

flex_angles, gyroY_angles, gyroZ_angles = [], [], []
overlay_images, skeletal_images = [], []

print("OUTPUT DIR:", output_dir, file=sys.stderr)
print("IMAGE PATHS:", image_paths, file=sys.stderr)

def img_to_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")
    
# ---------------------------
# VALIDATE & PREPARE OUTPUT DIR
# ---------------------------
if os.path.exists(output_dir) and not os.path.isdir(output_dir):
    print(f"ERROR: output_dir is not a directory: {output_dir}", file=sys.stderr)
    sys.exit(1)

os.makedirs(output_dir, exist_ok=True)

# ---------------------------
# PROCESS
# ---------------------------
with mp_pose.Pose(static_image_mode=True) as pose:
    for img_path in image_paths:
        img = cv2.imread(img_path)
        if img is None:
            continue

        h, w, _ = img.shape
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = pose.process(rgb)

        if not res.pose_landmarks:
            continue

        lm = res.pose_landmarks.landmark

        shoulder = [
            lm[mp_pose.PoseLandmark.LEFT_SHOULDER].x * w,
            lm[mp_pose.PoseLandmark.LEFT_SHOULDER].y * h
        ]
        hip = [
            lm[mp_pose.PoseLandmark.LEFT_HIP].x * w,
            lm[mp_pose.PoseLandmark.LEFT_HIP].y * h
        ]
        ear = [
            lm[mp_pose.PoseLandmark.LEFT_EAR].x * w,
            lm[mp_pose.PoseLandmark.LEFT_EAR].y * h
        ]
        r_shoulder = [
            lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].x * w,
            lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * h
        ]

        # FLEX
        raw_flex = math.degrees(math.atan2(
            ear[0] - shoulder[0],
            shoulder[1] - ear[1]
        ))
        flex = max(0, raw_flex)
        flex_angles.append(flex)

        # GYRO Y
        dxY = shoulder[0] - hip[0]
        dyY = shoulder[1] - hip[1]
        mag = math.sqrt(dxY**2 + dyY**2) + 1e-6
        angleY = math.degrees(math.acos(max(-1, min(1, -dyY / mag))))
        gyroY_angles.append(angleY)

        # GYRO Z
        dxZ = r_shoulder[0] - shoulder[0]
        dyZ = r_shoulder[1] - shoulder[1]
        angleZ = math.degrees(math.atan(dyZ / (abs(dxZ) + 1e-6)))
        angleZ = max(-15, min(15, angleZ))
        gyroZ_angles.append(angleZ)

        # OVERLAY IMAGE
        overlay = img.copy()
        mp_drawing.draw_landmarks(
            overlay, res.pose_landmarks, mp_pose.POSE_CONNECTIONS,
            drawing_spec_landmarks, drawing_spec_connections
        )

        cv2.putText(overlay, f"Flex: {flex:.2f}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

        skeletal = np.zeros_like(img)
        mp_drawing.draw_landmarks(
            skeletal, res.pose_landmarks, mp_pose.POSE_CONNECTIONS,
            drawing_spec_landmarks, drawing_spec_connections
        )


        base = os.path.splitext(os.path.basename(img_path))[0]
        overlay_path = os.path.join(output_dir, f"{base}_overlay.jpg")
        skeletal_path = os.path.join(output_dir, f"{base}_skeletal.jpg")

        cv2.imwrite(overlay_path, overlay)
        cv2.imwrite(skeletal_path, skeletal)

        overlay_images.append(img_to_base64(overlay_path))
        skeletal_images.append(img_to_base64(skeletal_path))

# ---------------------------
# OUTPUT
# ---------------------------
print(json.dumps({
    "flex_sensor_baseline": sum(flex_angles)/len(flex_angles) if flex_angles else None,
    "gyroY_baseline": sum(gyroY_angles)/len(gyroY_angles) if gyroY_angles else None,
    "gyroZ_baseline": sum(gyroZ_angles)/len(gyroZ_angles) if gyroZ_angles else None,
    "processed_images": overlay_images,
    "skeletal_images": skeletal_images
}))