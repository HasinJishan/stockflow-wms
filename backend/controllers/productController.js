const Product = require('../models/Product');
const createNotification = require('../utils/createNotification');
const Notification = require('../models/Notification');

// Compute the correct status string based on quantity vs reorderLevel
const computeStatus = (quantity, reorderLevel) => {
    if (quantity <= 0) return "Out of stock";
    if (quantity <= reorderLevel) return "Low stock";
    return "In stock";
};

// Fire a low-stock notification if needed (avoids duplicate spam)
const checkLowStock = async (product) => {
    if (product.quantity <= product.reorderLevel) {
        const priority = product.quantity <= 0 ? 'red' : 'amber';
        const title = product.quantity <= 0
            ? `Out of stock: ${product.name}`
            : `Low stock: ${product.name}`;

        const existing = await Notification.findOne({
            category: 'inventory',
            title,
            unread: true
        });

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
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const data = { ...req.body };
        data.status = computeStatus(data.quantity ?? 0, data.reorderLevel ?? 0);

        const product = new Product(data);
        await product.save();
        await checkLowStock(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const data = { ...req.body };

        // Recompute status if quantity or reorderLevel is part of this update
        if (data.quantity !== undefined || data.reorderLevel !== undefined) {
            const current = await Product.findById(req.params.id);
            if (!current) return res.status(404).json({ message: "Product not found" });

            const newQuantity = data.quantity !== undefined ? data.quantity : current.quantity;
            const newReorderLevel = data.reorderLevel !== undefined ? data.reorderLevel : current.reorderLevel;
            data.status = computeStatus(newQuantity, newReorderLevel);
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        if (updatedProduct) {
            await checkLowStock(updatedProduct);
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};