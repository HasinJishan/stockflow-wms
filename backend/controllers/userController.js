const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// GET all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// GET single user by ID (admin only)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// CREATE a new user (admin only) - e.g. from "Add user" page
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, role } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({ message: "Full name and email are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "A user with this email already exists" });

        // Generate a temporary random password since admin-created users don't set one immediately
        const tempPassword = crypto.randomBytes(6).toString('hex'); // e.g. "a1b2c3d4e5f6"
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        // Map frontend role labels to backend enum values
        const roleMap = { Admin: 'admin', Manager: 'admin', 'Warehouse staff': 'staff', Customer: 'customer' };
        const mappedRole = roleMap[role] || 'customer';

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: mappedRole,
            isVerified: true // Admin-created users are considered verified immediately
        });

        res.status(201).json({
            message: "User created successfully",
            tempPassword, // Return this once so the admin can share it manually (since email may not deliver to all addresses yet)
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// UPDATE a user's role (admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const roleMap = { Admin: 'admin', Manager: 'admin', 'Warehouse staff': 'staff', Customer: 'customer' };
        const mappedRole = roleMap[role] || role; // allow raw backend values too

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: mappedRole },
            { new: true }
        ).select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Role updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// DELETE a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// UPDATE own profile (any logged-in user)
exports.updateOwnProfile = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existing) return res.status(400).json({ message: "That email is already in use" });
        }

        const updates = {};
        if (fullName) updates.fullName = fullName;
        if (email) updates.email = email;

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
            .select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// UPDATE own password (any logged-in user)
exports.updateOwnPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};