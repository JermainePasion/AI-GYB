const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const PostureLog = require("../models/PostureLog");

const router = express.Router();

// @route POST /api/logs/upload
router.post("/upload", protect, asyncHandler(async (req, res) => {
  const { csv, filename } = req.body;

  if (!csv) {
    return res.status(400).json({ message: "CSV data is required" });
  }

  const log = await PostureLog.create({
    user: req.user.id,
    filename: filename || `log-${Date.now()}.csv`,
    data: csv
  });

  res.status(201).json({ message: "Log uploaded successfully", log });
}));

// @route GET /api/logs/my
router.get("/my", protect, asyncHandler(async (req, res) => {
  const logs = await PostureLog.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(logs);
}));

module.exports = router;
