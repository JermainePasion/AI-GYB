const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/users/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      username,
      email,
      password,
      role
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
      res.status(400);
      throw new Error("Invalid user data");
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
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

router.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    // req.user is populated by protect middleware (with user data excluding password)
    if (req.user) {
      res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        posture_thresholds: req.user.posture_thresholds || {}
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

router.get(
  "/thresholds",
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(req.user.posture_thresholds || {});
  })
);

module.exports = router;
