const mongoose = require("mongoose");

const postureLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String },
  data: { type: String }, // CSV content
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PostureLog", postureLogSchema);
