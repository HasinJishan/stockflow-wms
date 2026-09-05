const User = require('../models/User');

// GET all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};