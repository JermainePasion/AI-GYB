const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const PostureLog = require("../models/PostureLog");

const router = express.Router();

router.post(
  "/upload",
  protect,
  asyncHandler(async (req, res) => {
    const { csv, filename, append } = req.body;

    if (!csv) {
      return res.status(400).json({ message: "CSV data is required" });
    }

    // Find existing log with the same filename for this user
    let log = await PostureLog.findOne({ user: req.user.id, filename });

    if (log && append) {
      // Append new data (skip header)
      log.data += "\n" + csv.split("\n").slice(1).join("\n");
      await log.save();
      return res.json({ message: "Log updated successfully (appended)", log });
    } else if (!log) {
      // Create new log
      log = await PostureLog.create({
        user: req.user.id,
        filename: filename || `log-${Date.now()}.csv`,
        data: csv,
      });
      return res.status(201).json({ message: "Log created successfully", log });
    } else {
      // If log exists but append is false, overwrite
      log.data = csv;
      await log.save();
      return res.json({ message: "Log overwritten successfully", log });
    }
  })
);


router.get("/my", protect, asyncHandler(async (req, res) => {
  const logs = await PostureLog.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(logs);
}));

module.exports = router;
