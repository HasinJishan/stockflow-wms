const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['inventory', 'orders', 'users', 'system'],
        required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['none', 'amber', 'red'], default: 'none' },
    unread: { type: Boolean, default: true },
    link: { type: String } // optional frontend route to navigate to, e.g. "/admin/inventory"
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);