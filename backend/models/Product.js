const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    unit: { type: String, default: "Each" },
    description: { type: String },
    costPrice: { type: Number, default: 0 },
    price: { type: Number, required: true }, // Selling price
    quantity: { type: Number, default: 0 }, // Current stock
    reorderLevel: { type: Number, default: 0 },
    maxStock: { type: Number, default: 100 },
    supplier: { type: String, default: "Coimbatore Packaging Co." },
    leadTime: { type: String, default: "5 days" },
    warehouseLocation: { type: String }, // e.g. "Coimbatore"
    binLocation: { type: String }, // e.g. "B-14"
    status: { type: String, default: "In stock" },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);