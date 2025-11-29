const mongoose = require("mongoose");

const painEventSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  painLocation: { type: String, required: true },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }
});

const postureLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String },
  data: { type: String }, // CSV content
  painEvents: [painEventSchema], // <--- NEW COLUMN
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PostureLog", postureLogSchema);
