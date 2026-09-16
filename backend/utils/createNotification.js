const Notification = require('../models/Notification');

const createNotification = async ({ category, title, description, priority = 'none', link }) => {
    try {
        await Notification.create({ category, title, description, priority, link });
    } catch (error) {
        console.error("Failed to create notification:", error.message);
    }
};

module.exports = createNotification;