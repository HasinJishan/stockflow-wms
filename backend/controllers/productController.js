const Product = require('../models/Product');
const createNotification = require('../utils/createNotification');

// Helper: check if a product is low/out of stock and fire a notification if needed
const checkLowStock = async (product) => {
    if (product.quantity <= product.reorderLevel) {
        const priority = product.quantity <= 0 ? 'red' : 'amber';
        const title = product.quantity <= 0
            ? `Out of stock: ${product.name}`
            : `Low stock: ${product.name}`;

        // Avoid duplicate spam: only create a new notification if there isn't already
        // an unread low-stock notification for this exact product
        const Notification = require('../models/Notification');
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
        const product = new Product(req.body);
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
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
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