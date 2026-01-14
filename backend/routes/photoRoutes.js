const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

const router = express.Router();

// ---------------------------
// MULTER TEMP STORAGE
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.uploadDir) {
      const sessionId = crypto.randomUUID();
      req.uploadDir = path.join(os.tmpdir(), `upload-${sessionId}`);
      fs.mkdirSync(req.uploadDir, { recursive: true });
    }
    cb(null, req.uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ---------------------------
// ROUTE
// ---------------------------
router.post(
  "/upload-photos",
  protect,
  upload.array("photos", 5),
  async (req, res) => {
    try {
      const imagePaths = req.files.map(f => path.resolve(f.path));

      const python = spawn("python", [
        "./python/process_photos.py",
        req.uploadDir,
        ...imagePaths
      ]);

      let output = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
      });

      // ✅ CAPTURE STDERR (ERRORS)
      python.stderr.on("data", (data) => {
        console.error("🐍 PYTHON ERROR:", data.toString());
      });

      python.on("close", async () => {
        try {
          const result = JSON.parse(output);

          const user = await User.findByIdAndUpdate(
            req.user._id,
            {
              posture_baseline: {
                flex_sensor_baseline: result.flex_sensor_baseline,
                gyroY_baseline: result.gyroY_baseline,
                gyroZ_baseline: result.gyroZ_baseline
              },
              posture_thresholds: {
                flex_min: result.flex_sensor_baseline - 5,
                flex_max: result.flex_sensor_baseline + 5,
                gyroY_min: result.gyroY_baseline - 5,
                gyroY_max: result.gyroY_baseline + 5,
                gyroZ_min: result.gyroZ_baseline - 5,
                gyroZ_max: result.gyroZ_baseline + 5
              }
            },
            { new: true }
          );

          res.json({
            message: "Photos processed",
            processed_images: result.processed_images,
            skeletal_images: result.skeletal_images,
            thresholds: user.posture_thresholds
          });

        } finally {
          // 🔥 GUARANTEED CLEANUP
          fs.rm(req.uploadDir, { recursive: true, force: true }, () => {});
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;
