const { spawn } = require("child_process");
const PostureLog = require("../models/PostureLog");
const User = require("../models/User");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

exports.adjustThresholdOnLogout = async (req, res) => {
  try {
    const logs = await PostureLog.find({ user: req.user.id });

    if (!logs.length) {
      return res.json({ message: "No logs found. Threshold unchanged." });
    }

    const sessionId = crypto.randomUUID();
    const tempDir = path.join(os.tmpdir(), `logs-${sessionId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    logs.forEach((log, index) => {
      const filePath = path.join(tempDir, `log-${index}.csv`);
      fs.writeFileSync(filePath, log.data);
    });

    const python = spawn("python", [
      "./ml/update_thresholds.py",
      tempDir,
    ]);

    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("PYTHON ERROR:", data.toString());
    });

    python.on("close", async () => {
        try {
            if (!output) {
            return res.status(500).json({ message: "Python returned no output" });
            }

            const result = JSON.parse(output);

            if (result.error) {
            console.log("Python returned error:", result.error);
            return res.json({ message: result.error });
            }

            const user = await User.findById(req.user.id);

            const current = user.posture_thresholds || {
            flex_min: 0,
            flex_max: 0,
            gyroY_min: 0,
            gyroY_max: 0,
            gyroZ_min: 0,
            gyroZ_max: 0,
            };
            console.log("User ID:", req.user.id);
            console.log("Current Thresholds:", current);
            console.log("Adjustment Returned:", result.adjustment);
            console.log("Metrics:", result.metrics);
            console.log("===========================");

            const { flex, gyroY, gyroZ } = result.adjustment;

            user.posture_thresholds = {
            flex_min: current.flex_min + flex,
            flex_max: current.flex_max + flex,

            gyroY_min: current.gyroY_min + gyroY,
            gyroY_max: current.gyroY_max + gyroY,

            gyroZ_min: current.gyroZ_min + gyroZ,
            gyroZ_max: current.gyroZ_max + gyroZ,
            };

            await user.save();

            console.log("New Thresholds Saved:", user.posture_thresholds);

            res.json({
            message: "Thresholds adjusted incrementally",
            adjustment: result.adjustment,
            new_thresholds: user.posture_thresholds,
            });

        } catch (err) {
            console.error("Threshold adjustment failed:", err);
            res.status(500).json({ message: "Threshold adjustment failed" });
        } finally {
            fs.rm(tempDir, { recursive: true, force: true }, () => {});
        }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Threshold adjustment failed" });
  }
};