const mongoose = require('mongoose');

const SavedItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

SavedItemSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('SavedItem', SavedItemSchema);