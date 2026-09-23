const SavedItem = require('../models/SavedItem');

exports.getMySavedItems = async (req, res) => {
    try {
        const saved = await SavedItem.find({ user: req.user.id }).populate('product');
        const items = saved.filter((s) => s.product).map((s) => ({ savedId: s._id, ...s.product.toObject() }));
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.addSavedItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const existing = await SavedItem.findOne({ user: req.user.id, product: productId });
        if (existing) return res.status(400).json({ message: "Already saved" });
        const item = await SavedItem.create({ user: req.user.id, product: productId });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.removeSavedItem = async (req, res) => {
    try {
        await SavedItem.findOneAndDelete({ user: req.user.id, product: req.params.productId });
        res.status(200).json({ message: "Removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};