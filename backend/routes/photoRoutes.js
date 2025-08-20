// routes/photoRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ✅ Utility to make URLs safely
const makeUrl = (req, p) => {
  if (!p) return null;
  if (p.startsWith("http")) return p; // already a full URL, return as-is
  const rel = p.replace(/\\/g, "/").replace(/^(\.\/)+/, "");
  return `${req.protocol}://${req.get("host")}/${rel}`;
};

router.post("/upload-photos", protect, upload.array("photos", 5), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const imagePaths = req.files.map(file => path.join(__dirname, "..", file.path));

    // Spawn Python process
    const pythonProcess = spawn("python", ["./python/process_photos.py", ...imagePaths]);
    let dataString = "";

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.warn("Python stderr:", data.toString());
    });

    pythonProcess.on("close", async () => {
      try {
        console.log("Raw Python output:", dataString);
        const result = JSON.parse(dataString);

        // Save thresholds to user
        const updatedUser = await User.findByIdAndUpdate(
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

        // ✅ Convert local paths → full URLs
        const processedImageUrls = (result.processed_images || []).map(p => makeUrl(req, p));
        const skeletalImageUrls  = (result.skeletal_images  || []).map(p => makeUrl(req, p));

        res.json({
          message: "Photos processed & thresholds saved",
          processed_images: processedImageUrls,
          skeletal_images: skeletalImageUrls,
          thresholds: updatedUser.posture_thresholds
        });

      } catch (err) {
        console.error("Error parsing Python output or saving thresholds:", err);
        res.status(500).json({ message: "Error processing photos" });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
