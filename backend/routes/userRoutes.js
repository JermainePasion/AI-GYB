const express = require("express");
const multer = require("multer");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getProfile,
  getThresholds,
  updateThresholds,
  registerDoctor,
  approveDoctor,
  getUsers,
  uploadLog,
  getUserById,
} = require("../controllers/userController");

const {adjustThresholdOnLogout} = require("../controllers/thresholdAdjustmentController")

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post("/register", registerUser);
router.post("/login", loginUser);


router.get("/profile", protect, getProfile);


router.get("/thresholds", protect, getThresholds);
router.put("/thresholds", protect, updateThresholds);


router.post("/register-doctor", registerDoctor);
router.put("/approve/:id", protect, authorize("admin"), approveDoctor);


router.get("/", protect, authorize("admin", "doctor"), getUsers);
router.get("/:id", protect, authorize("admin", "doctor"), getUserById);


router.post("/upload-log", protect, upload.single("file"), uploadLog);

router.post("/logout-adjust", protect, adjustThresholdOnLogout);

module.exports = router;
