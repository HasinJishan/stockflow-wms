const StockAdjustment = require('../models/StockAdjustment');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const createNotification = require('../utils/createNotification');

const computeStatus = (quantity, reorderLevel) => {
    if (quantity <= 0) return "Out of stock";
    if (quantity <= reorderLevel) return "Low stock";
    return "In stock";
};

exports.getAdjustments = async (req, res) => {
    try {
        const adjustments = await StockAdjustment.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(adjustments);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.createAdjustment = async (req, res) => {
    try {
        const { productId, changeType, quantity, reason, notes } = req.body;

        if (!productId || !changeType || !quantity || !reason) {
            return res.status(400).json({ message: "Product, adjustment type, quantity, and reason are required" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const qty = parseInt(quantity, 10);
        const newQuantity = changeType === 'add'
            ? product.quantity + qty
            : Math.max(0, product.quantity - qty);

        product.quantity = newQuantity;
        product.status = computeStatus(newQuantity, product.reorderLevel);
        await product.save();

        // Fire low-stock notification if applicable, avoiding duplicates
        if (product.quantity <= product.reorderLevel) {
            const priority = product.quantity <= 0 ? 'red' : 'amber';
            const title = product.quantity <= 0
                ? `Out of stock: ${product.name}`
                : `Low stock: ${product.name}`;
            const existing = await Notification.findOne({ category: 'inventory', title, unread: true });
            if (!existing) {
                await createNotification({
                    category: 'inventory',
                    title,
                    description: `${product.name} is at ${product.quantity} units — below the reorder level of ${product.reorderLevel}.`,
                    priority,
                    link: '/admin/inventory'
                });
            }
        }

        const adjustment = await StockAdjustment.create({
            product: product._id,
            productName: product.name,
            sku: product.sku,
            changeType,
            quantity: qty,
            reason,
            notes,
            submittedBy: req.user.id,
            submittedByName: req.body.submittedByName || "Staff"
        });

        res.status(201).json({ message: "Stock update applied", adjustment, newQuantity: product.quantity });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};