const User = require('../models/User');

// @desc    Get all users for task assignment
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    // Password hata kar baaki details bhejenge
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};