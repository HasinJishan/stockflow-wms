const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Ensure this utility exists

// 1. REGISTER (Professional: Force role + Send Verification)
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Professional: Create verification token
        const vToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({ 
            fullName, 
            email, 
            password: hashedPassword, 
            role: 'customer', // Force 'customer' for safety
            verificationToken: vToken 
        });

        // Professional: Send Verification Email (won't block registration if it fails)
        const vUrl = `${process.env.FRONTEND_URL}/verify-email/${vToken}`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your Account',
                message: `<h1>Welcome to WMS</h1><p>Click <a href="${vUrl}">here</a> to verify your email.</p>`
            });
        } catch (emailError) {
            console.error("⚠️ Verification email failed to send:", emailError.message);
            // Registration still succeeds even if email fails
        }

        res.status(201).json({ message: "Registered! Please check your email to verify your account." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. LOGIN (Professional: Check if Verified)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Security: Block unverified users
        // TEMPORARILY DISABLED until email verification works for all users (Resend sandbox limit)
        // if (!user.isVerified) {
        //     return res.status(401).json({ message: "Please verify your email address first." });
        // }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. FORGOT PASSWORD (Real-World: Sends Email)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message: `<h1>Password Reset</h1><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
            });
            res.status(200).json({ message: "Reset link sent to email" });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 4. RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};