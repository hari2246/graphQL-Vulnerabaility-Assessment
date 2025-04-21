const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  department: { type: String },
  role: { type: String, default: 'user' },
  phoneNumber: { type: String },
  joinDate: { type: Date, default: Date.now },
  profilePicture: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
