const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

/* =====================
   HELPERS
===================== */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.registerUser = asyncHandler(async (req, res) => {
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

  if (!user) {
    return res.status(400).json({ message: "Invalid user data" });
  }

  res.status(201).json({
    _id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user.id),
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
      posture_thresholds: user.posture_thresholds,
      last_threshold_adjustment: user.last_threshold_adjustment || null
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});


exports.getProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    posture_thresholds: req.user.posture_thresholds || {},
    last_threshold_adjustment: req.user.last_threshold_adjustment || null
  });
});


exports.getThresholds = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("posture_thresholds");
  res.json(user.posture_thresholds || {});
});

exports.updateThresholds = asyncHandler(async (req, res) => {
  const { flex_min, flex_max, gyroY_min, gyroY_max, gyroZ_min, gyroZ_max } = req.body;
  const user = await User.findById(req.user.id);

  user.posture_thresholds = {
    flex_min,
    flex_max,
    gyroY_min,
    gyroY_max,
    gyroZ_min,
    gyroZ_max,
  };

  await user.save();
  res.json(user.posture_thresholds);
});


exports.registerDoctor = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  await User.create({
    username,
    email,
    password,
    role: "doctor",
    status: "pending",
  });

  res.status(201).json({
    message: "Doctor registration submitted. Awaiting admin approval.",
  });
});


exports.approveDoctor = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  doctor.status = "active";
  await doctor.save();

  res.json({ message: "Doctor approved successfully", doctor });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});


exports.uploadLog = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.posture_logs.push({
    filename: req.file.originalname,
    data: req.file.buffer.toString("utf-8"),
  });

  await user.save();
  res.json({ message: "Log uploaded successfully", logs: user.posture_logs });
});


exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});
