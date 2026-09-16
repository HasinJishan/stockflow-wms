const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notif = await Notification.findByIdAndUpdate(req.params.id, { unread: false }, { new: true });
        if (!notif) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json(notif);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ unread: true }, { unread: false });
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};