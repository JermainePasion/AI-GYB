import sys, os, json, math, cv2
import mediapipe as mp

# Get photo paths from Node.js arguments
image_paths = sys.argv[1:]

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Lists for storing multiple image readings
flex_angles = []
gyroY_angles = []
gyroZ_angles = []
processed_images = []

with mp_pose.Pose(static_image_mode=True) as pose:
    for img_path in image_paths:
        img = cv2.imread(img_path)
        h, w, _ = img.shape
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = pose.process(rgb)

        if res.pose_landmarks:
            lm = res.pose_landmarks.landmark

            # Key landmarks
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

            # FLEX SENSOR baseline (signed, upright ≈ 0°)
            raw_flex_angle = math.degrees(math.atan2(ear[0] - shoulder[0], shoulder[1] - ear[1]))
            # Clamp backward tilt to 0 (only forward tilt measured)
            flex_angle = raw_flex_angle if raw_flex_angle > 0 else 0
            flex_angles.append(flex_angle)

            # GYRO Y baseline (forward/back tilt)
            dyY = shoulder[1] - hip[1]
            dxY = shoulder[0] - hip[0]
            gyroY_angle = math.degrees(math.atan2(dxY, dyY))
            gyroY_angles.append(gyroY_angle)

            # GYRO Z baseline (side tilt)
            dyZ = r_shoulder[1] - shoulder[1]
            dxZ = r_shoulder[0] - shoulder[0]
            gyroZ_angle = math.degrees(math.atan2(dyZ, dxZ))
            gyroZ_angles.append(gyroZ_angle)

            # Draw landmarks on image
            mp_drawing.draw_landmarks(img, res.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Save processed image
        out_dir = os.path.join("uploads", "processed")
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, os.path.basename(img_path))
        cv2.imwrite(out_path, img)
        processed_images.append(out_path)

# Prepare JSON result
output_data = {
    "flex_sensor_baseline": sum(flex_angles) / len(flex_angles) if flex_angles else None,
    "gyroY_baseline": sum(gyroY_angles) / len(gyroY_angles) if gyroY_angles else None,
    "gyroZ_baseline": sum(gyroZ_angles) / len(gyroZ_angles) if gyroZ_angles else None,
    "processed_images": processed_images
}

# Send to Node
print(json.dumps(output_data))
