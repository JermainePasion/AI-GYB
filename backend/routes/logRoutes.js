const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect, authorize } = require("../middleware/authMiddleware");
const PostureLog = require("../models/PostureLog");

const router = express.Router();

router.post(
  "/upload",
  protect,
  asyncHandler(async (req, res) => {
    const { csv, filename, append } = req.body;
    if (!csv) return res.status(400).json({ message: "CSV data is required" });

    // Find existing log or create a new one
    let log = await PostureLog.findOne({ user: req.user.id, filename });
    if (!log) {
      log = await PostureLog.create({
        user: req.user.id,
        filename: filename || `log-${Date.now()}.csv`,
        data: "",
        painEvents: []
      });
    }

    // Use the CSV as-is; frontend already includes painX/painY
    if (append && log.data) {
      // Remove header from incoming CSV before appending
      const rows = csv.split("\n").slice(1).join("\n");
      log.data += "\n" + rows;
    } else {
      log.data = csv;
    }

    await log.save();

    return res.json({ message: append ? "Log updated successfully (appended)" : "Log overwritten successfully", log });
  })
);


router.get("/my", protect, asyncHandler(async (req, res) => {
  const logs = await PostureLog.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(logs);
}));

router.get(
  "/:userId",
  protect,
  authorize("admin", "doctor"),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const logs = await PostureLog.find({ user: userId }).sort({ createdAt: -1 });

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No logs found for this user" });
    }

    res.json(logs);
  })
);

//
// NEW — ADD PAIN LOG TO A POSTURE LOG
//
router.post(
  "/:logId/pain",
  protect,
  asyncHandler(async (req, res) => {
    const { logId } = req.params;
    const { timestamp, painLocation, coordinates } = req.body;

    if (!timestamp || !painLocation || !coordinates) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the posture log
    const log = await PostureLog.findOne({ _id: logId, user: req.user.id });
    if (!log) return res.status(404).json({ message: "Posture log not found" });

    // Add pain event
    log.painEvents.push({ timestamp, painLocation, coordinates });

    // Merge pain into CSV immediately
    if (log.data) {
      const rows = log.data.split("\n");
      const header = rows[0];
      const dataRows = rows.slice(1);

      const mergedRows = dataRows.map(row => {
        const [rowTimestamp, flex, gyroY, gyroZ, stage, painX, painY] = row.split(",");
        // match timestamps exactly
        if (rowTimestamp === timestamp) {
          return [rowTimestamp, flex, gyroY, gyroZ, stage, coordinates.x, coordinates.y].join(",");
        }
        return [rowTimestamp, flex, gyroY, gyroZ, stage, painX || 0, painY || 0].join(",");
      });

      log.data = [header.includes("painX") ? header : header + ",painX,painY", ...mergedRows].join("\n");
    }

    await log.save();

    res.status(201).json({
      message: "Pain point added and CSV merged",
      log
    });
  })
);
module.exports = router;
