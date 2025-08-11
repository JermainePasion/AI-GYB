import sys, os, json, cv2, math
import mediapipe as mp

image_paths = sys.argv[1:]
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

results_data = {
    "flex_sensor_angles": [],
    "gyroY_angles": [],
    "gyroZ_angles": [],
    "processed_images": []
}

def angle_from_points(a, b, c):
    ang = math.degrees(
        math.atan2(c[1] - b[1], c[0] - b[0]) -
        math.atan2(a[1] - b[1], a[0] - b[0])
    )
    return abs(ang)

with mp_pose.Pose(static_image_mode=True) as pose:
    for path in image_paths:
        img = cv2.imread(path)
        h, w, _ = img.shape
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = pose.process(rgb)

        if res.pose_landmarks:
            lm = res.pose_landmarks.landmark

            # Get relevant coordinates (convert to pixels)
            shoulder = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER].x * w,
                        lm[mp_pose.PoseLandmark.LEFT_SHOULDER].y * h]
            hip = [lm[mp_pose.PoseLandmark.LEFT_HIP].x * w,
                   lm[mp_pose.PoseLandmark.LEFT_HIP].y * h]
            ear = [lm[mp_pose.PoseLandmark.LEFT_EAR].x * w,
                   lm[mp_pose.PoseLandmark.LEFT_EAR].y * h]
            r_shoulder = [lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].x * w,
                          lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * h]

            # FLEX SENSOR (front/back)
            flex_angle = angle_from_points(hip, shoulder, ear)
            results_data["flex_sensor_angles"].append(flex_angle)

            # GYRO Y (forward/back tilt)
            dy = shoulder[1] - hip[1]
            dx = shoulder[0] - hip[0]
            gyroY_angle = math.degrees(math.atan2(dx, dy))
            results_data["gyroY_angles"].append(gyroY_angle)

            # GYRO Z (side tilt)
            dy_shoulder = r_shoulder[1] - shoulder[1]
            dx_shoulder = r_shoulder[0] - shoulder[0]
            gyroZ_angle = math.degrees(math.atan2(dy_shoulder, dx_shoulder))
            results_data["gyroZ_angles"].append(gyroZ_angle)

            # Draw landmarks
            mp_drawing.draw_landmarks(img, res.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            out_dir = "uploads/processed"
            os.makedirs(out_dir, exist_ok=True)
            out_path = os.path.join(out_dir, os.path.basename(path))
            cv2.imwrite(out_path, img)
            results_data["processed_images"].append(out_path)

# Average values
results_data["flex_sensor_baseline"] = sum(results_data["flex_sensor_angles"]) / len(results_data["flex_sensor_angles"])
results_data["gyroY_baseline"] = sum(results_data["gyroY_angles"]) / len(results_data["gyroY_angles"])
results_data["gyroZ_baseline"] = sum(results_data["gyroZ_angles"]) / len(results_data["gyroZ_angles"])

print(json.dumps(results_data))
