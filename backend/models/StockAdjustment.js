const mongoose = require('mongoose');

const StockAdjustmentSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: String,
    sku: String,
    changeType: { type: String, enum: ['add', 'remove'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true },
    notes: String,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submittedByName: String
}, { timestamps: true });

module.exports = mongoose.model('StockAdjustment', StockAdjustmentSchema);