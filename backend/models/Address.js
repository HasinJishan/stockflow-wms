const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefaultDelivery: { type: Boolean, default: false },
    isDefaultBilling: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);