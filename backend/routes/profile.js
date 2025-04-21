const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.put('/update-profile', auth, async (req, res) => {
  try {
    const { fullName, department, phoneNumber, email } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.department = department || user.department;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.email = email || user.email;
    user.lastUpdated = Date.now();

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;