import sys, os, json, math, cv2
import mediapipe as mp
import numpy as np
import mediapipe.python.solutions.drawing_utils as mp_drawing

# 🎨 Custom drawing colors
drawing_spec_landmarks = mp_drawing.DrawingSpec(color=(217,204,164), thickness=4, circle_radius=3)  # beige
drawing_spec_connections = mp_drawing.DrawingSpec(color=(255,0,0), thickness=3, circle_radius=2)   # red

# Get photo paths from Node.js arguments
image_paths = sys.argv[1:]

mp_pose = mp.solutions.pose

# Lists for storing multiple image readings
flex_angles, gyroY_angles, gyroZ_angles = [], [], []
overlay_images, skeletal_images = [], []

with mp_pose.Pose(static_image_mode=True) as pose:
    for img_path in image_paths:
        img = cv2.imread(img_path)
        h, w, _ = img.shape
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = pose.process(rgb)

        if res.pose_landmarks:
            lm = res.pose_landmarks.landmark

            # Key landmarks
            shoulder = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER].x * w,
                        lm[mp_pose.PoseLandmark.LEFT_SHOULDER].y * h]
            hip = [lm[mp_pose.PoseLandmark.LEFT_HIP].x * w,
                   lm[mp_pose.PoseLandmark.LEFT_HIP].y * h]
            ear = [lm[mp_pose.PoseLandmark.LEFT_EAR].x * w,
                   lm[mp_pose.PoseLandmark.LEFT_EAR].y * h]
            r_shoulder = [lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].x * w,
                          lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * h]

            # FLEX SENSOR baseline
            raw_flex_angle = math.degrees(math.atan2(ear[0] - shoulder[0], shoulder[1] - ear[1]))
            flex_angle = raw_flex_angle if raw_flex_angle > 0 else 0
            flex_angles.append(flex_angle)

            # GYRO Y baseline
            dxY, dyY = shoulder[0] - hip[0], shoulder[1] - hip[1]
            refY = (0, -1)  # upright vector
            dot = dxY * refY[0] + dyY * refY[1]
            mag1 = math.sqrt(dxY**2 + dyY**2)
            mag2 = math.sqrt(refY[0]**2 + refY[1]**2)
            cos_theta = dot / (mag1 * mag2 + 1e-6)
            angle = math.degrees(math.acos(max(-1, min(1, cos_theta))))
            cross = dxY * refY[1] - dyY * refY[0]
            if cross < 0:
                angle = -angle
            gyroY_angles.append(angle)

            # GYRO Z baseline
            dyZ = r_shoulder[1] - shoulder[1]
            dxZ = r_shoulder[0] - shoulder[0]
            gyroZ_angle = math.degrees(math.atan2(dyZ, dxZ))
            gyroZ_angles.append(gyroZ_angle)

            # --- Draw Overlay version (pose on original image) ---
            overlay_img = img.copy()
            mp_drawing.draw_landmarks(
                overlay_img, res.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=drawing_spec_landmarks,
                connection_drawing_spec=drawing_spec_connections
            )
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.8
            color = (255, 255, 255)   # white text
            thickness = 2

            cv2.putText(overlay_img, f"Flex Angle: {flex_angle:.2f}°", 
            (10, 30), font, font_scale, color, thickness, cv2.LINE_AA)
            cv2.putText(overlay_img, f"GyroY Angle: {angle:.2f}°", 
            (10, 60), font, font_scale, color, thickness, cv2.LINE_AA)
            cv2.putText(overlay_img, f"GyroZ Angle: {gyroZ_angle:.2f}°", 
            (10, 90), font, font_scale, color, thickness, cv2.LINE_AA)

            # --- Draw Skeletal Only version (black background) ---
            skeletal_img = np.zeros_like(img)  # black background ✅
            mp_drawing.draw_landmarks(
                skeletal_img, res.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=drawing_spec_landmarks,
                connection_drawing_spec=drawing_spec_connections
            )

            # Save both
            out_dir = os.path.join("uploads", "processed")
            os.makedirs(out_dir, exist_ok=True)

            base = os.path.splitext(os.path.basename(img_path))[0]

            overlay_path = os.path.join(out_dir, f"{base}_overlay.jpg")
            skeletal_filename = f"{base}_skeletal.jpg"
            skeletal_path = os.path.join(out_dir, skeletal_filename)

            cv2.imwrite(overlay_path, overlay_img)
            cv2.imwrite(skeletal_path, skeletal_img)

            # Append local path for overlay (unchanged)
            overlay_images.append(overlay_path)

            # Append full URL for skeletal (fixed)
            skeletal_url = f"http://localhost:3000/uploads/processed/{skeletal_filename}"
            skeletal_images.append(skeletal_url)

# Prepare JSON result
output_data = {
    "flex_sensor_baseline": sum(flex_angles) / len(flex_angles) if flex_angles else None,
    "gyroY_baseline": sum(gyroY_angles) / len(gyroY_angles) if gyroY_angles else None,
    "gyroZ_baseline": sum(gyroZ_angles) / len(gyroZ_angles) if gyroZ_angles else None,
    "processed_images": overlay_images,   # local paths
    "skeletal_images": skeletal_images    # now full URLs
}

print(json.dumps(output_data))
