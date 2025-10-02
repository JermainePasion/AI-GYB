const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const PostureLog = require("../models/PostureLog");

const router = express.Router();

router.post(
  "/upload",
  protect,
  asyncHandler(async (req, res) => {
    const { csv } = req.body;

    if (!csv) {
      return res.status(400).json({ message: "CSV data is required" });
    }
    // Find existing log for this user
    let log = await PostureLog.findOne({ user: req.user.id });
    if (log) {
      // Append new data to existing log
      log.data += "\n" + csv.split("\n").slice(1).join("\n"); 
      await log.save();
      return res.json({ message: "Log updated successfully", log });
    } else {
      log = await PostureLog.create({
        user: req.user.id,
        filename: `log-${Date.now()}.csv`,
        data: csv,
      });
      return res.status(201).json({ message: "Log created successfully", log });
    }
  })
);

router.get("/my", protect, asyncHandler(async (req, res) => {
  const logs = await PostureLog.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(logs);
}));

module.exports = router;
