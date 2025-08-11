import sys
import json
import cv2
import mediapipe as mp
import os

# Input image paths from Node.js
image_paths = sys.argv[1:]

# Output directory for processed images
output_dir = "uploads/processed/"
os.makedirs(output_dir, exist_ok=True)

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

angles = []
processed_files = []

def calculate_angle(a, b, c):
    import math
    ang = math.degrees(
        math.atan2(c[1] - b[1], c[0] - b[0]) -
        math.atan2(a[1] - b[1], a[0] - b[0])
    )
    return abs(ang)

with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
    for path in image_paths:
        image = cv2.imread(path)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        if results.pose_landmarks:
            # Draw skeleton on image
            mp_drawing.draw_landmarks(
                image,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2),
            )

            lm = results.pose_landmarks.landmark
            shoulder = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                        lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            hip = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                   lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            ear = [lm[mp_pose.PoseLandmark.LEFT_EAR.value].x,
                   lm[mp_pose.PoseLandmark.LEFT_EAR.value].y]

            tilt_angle = calculate_angle(hip, shoulder, ear)
            angles.append(tilt_angle)

            # Save processed image with skeleton overlay
            filename = os.path.basename(path)
            output_path = os.path.join(output_dir, filename)
            cv2.imwrite(output_path, image)
            processed_files.append(output_path)

# Average threshold
baseline_threshold = sum(angles) / len(angles) if angles else 0

# Output JSON with thresholds + processed image paths
print(json.dumps({
    "tilt_angle": baseline_threshold,
    "processed_images": processed_files
}))
