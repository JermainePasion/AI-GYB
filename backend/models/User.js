const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const thresholdSchema = new mongoose.Schema({
  flex_min: { type: Number, default: null },
  flex_max: { type: Number, default: null },
  gyroY_min: { type: Number, default: null },
  gyroY_max: { type: Number, default: null },
  gyroZ_min: { type: Number, default: null },
  gyroZ_max: { type: Number, default: null }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["user", "doctor"], default: "user" },
  posture_baseline: {
    flex_sensor_baseline: { type: Number, default: null },
    gyroY_baseline: { type: Number, default: null },
    gyroZ_baseline: { type: Number, default: null }
  },
  posture_thresholds: { type: thresholdSchema, default: () => ({}) } // default empty object
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
