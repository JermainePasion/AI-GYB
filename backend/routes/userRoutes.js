// routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route   POST /api/users/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  })
);

// @route   POST /api/users/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  })
);

// @route   GET /api/users/profile
router.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    if (req.user) {
      res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        posture_thresholds: req.user.posture_thresholds || {},
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
);

// ✅ Threshold routes
// @route GET /api/users/thresholds
router.get("/thresholds", protect, asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("posture_thresholds");
    res.json(user.posture_thresholds || {});
  } catch (err) {
    res.status(500).json({ message: "Error fetching thresholds", error: err.message });
  }
}));

// @route PUT /api/users/thresholds
router.put("/thresholds", protect, asyncHandler(async (req, res) => {
  try {
    const { flex_min, flex_max, gyroY_min, gyroY_max, gyroZ_min, gyroZ_max } = req.body;
    const user = await User.findById(req.user.id);

    user.posture_thresholds = { flex_min, flex_max, gyroY_min, gyroY_max, gyroZ_min, gyroZ_max };
    await user.save();

    res.json(user.posture_thresholds);
  } catch (err) {
    res.status(500).json({ message: "Error updating thresholds", error: err.message });
  }
}));

// @route POST /api/users/register-doctor
router.post("/register-doctor", asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const doctor = await User.create({
    username,
    email,
    password,
    role: "doctor",
    status: "pending",
  });

  if (doctor) {
    res.status(201).json({
      message: "Doctor registration submitted. Awaiting admin approval.",
    });
  } else {
    res.status(400).json({ message: "Invalid doctor data" });
  }
}));

// @route PUT /api/users/approve/:id
router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const doctor = await User.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.status = "active";
    await doctor.save();

    res.json({ message: "Doctor approved successfully", doctor });
  })
);

// @route GET /api/users
router.get(
  "/",
  protect,
  authorize("admin", "doctor"),
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
  })
);

router.post(
  "/upload-log",
  protect,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.posture_logs.push({
        filename: req.file.originalname,
        data: req.file.buffer.toString("utf-8")
      });

      await user.save();
      res.json({ message: "Log uploaded successfully", logs: user.posture_logs });
    } catch (err) {
      res.status(500).json({ message: "Error uploading log", error: err.message });
    }
  })
);

module.exports = router;
