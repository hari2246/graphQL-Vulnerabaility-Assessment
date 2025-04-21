const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema({
  description: String,
  status: { type: String, default: "Open" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Bug", bugSchema);
