const mongoose = require("mongoose");

const postureLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String },
  data: { type: String },
  createdAt: { type: Date, default: Date.now },

  processed: { type: Boolean, default: false }
});

module.exports = mongoose.model("PostureLog", postureLogSchema);
