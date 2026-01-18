const asyncHandler = require("express-async-handler");
const PostureLog = require("../models/PostureLog");


exports.uploadLog = asyncHandler(async (req, res) => {
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
    log.data += "\n" + csv;
  } else {
    log.data = csv;
  }

  await log.save();
  res.json({ message: "CSV saved", log });
});


exports.getMyLogs = asyncHandler(async (req, res) => {
  const logs = await PostureLog.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(logs);
});


exports.deleteLog = asyncHandler(async (req, res) => {
  const log = await PostureLog.findById(req.params.id);

  if (!log) {
    return res.status(404).json({ message: "Log not found" });
  }

  if (
    log.user.toString() !== req.user.id &&
    !["admin", "doctor"].includes(req.user.role)
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await log.deleteOne();
  res.json({ message: "Log deleted successfully" });
});


exports.getLogsByUser = asyncHandler(async (req, res) => {
  const logs = await PostureLog.find({ user: req.params.id }).sort({
    createdAt: -1,
  });
  res.json(logs);
});
