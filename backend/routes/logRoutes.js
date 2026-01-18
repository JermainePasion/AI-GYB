const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  uploadLog,
  getMyLogs,
  deleteLog,
  getLogsByUser,
} = require("../controllers/logController");

const router = express.Router();

router.post("/upload", protect, uploadLog);
router.get("/my", protect, getMyLogs);
router.delete("/:id", protect, deleteLog);
router.get("/:id", protect, authorize("admin", "doctor"), getLogsByUser);

module.exports = router;
