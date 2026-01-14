const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect, authorize } = require("../middleware/authMiddleware");
const PostureLog = require("../models/PostureLog");

const router = express.Router();

/* =====================
   UPLOAD CSV
===================== */
router.post(
  "/upload",
  protect,
  asyncHandler(async (req, res) => {
    const { csv, filename, append } = req.body;
    if (!csv) return res.status(400).json({ message: "CSV required" });

    let log = await PostureLog.findOne({ user: req.user.id, filename });

    if (!log) {
      log = await PostureLog.create({
        user: req.user.id,
        filename,
        data: "",
      });
    }

    if (append && log.data) {
      log.data += "\n" + csv; // ✅ append raw rows
    } else {
      log.data = csv; // first upload includes header
    }

    await log.save();
    res.json({ message: "CSV saved", log });
  })
);

/* =====================
   GET MY LOGS
===================== */
router.get(
  "/my",
  protect,
  asyncHandler(async (req, res) => {
    const logs = await PostureLog.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(logs);
  })
);

module.exports = router;
