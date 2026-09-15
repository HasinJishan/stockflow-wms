const mongoose = require('mongoose');

const CompanySettingsSchema = new mongoose.Schema({
    name: { type: String, default: "StockFlow Logistics Pvt. Ltd." },
    email: { type: String, default: "ops@stockflow.com" },
    timezone: { type: String, default: "chennai" },
    currency: { type: String, default: "inr" }
}, { timestamps: true });

module.exports = mongoose.model('CompanySettings', CompanySettingsSchema);