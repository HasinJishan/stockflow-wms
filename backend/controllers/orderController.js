const Order = require('../models/Order');

// GET all orders (admin/staff)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// GET single order by order number
exports.getOrderByNumber = async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber })
            .populate('customer', 'fullName email createdAt');
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// CREATE new order (admin/staff)
exports.createOrder = async (req, res) => {
    try {
        const { customer, items, shippingMethod, deliveryAddress, paymentMethod, notes } = req.body;

        if (!customer || !items || items.length === 0 || !deliveryAddress) {
            return res.status(400).json({ message: "Customer, items, and delivery address are required" });
        }

        const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const shippingCost = shippingMethod === 'Express' ? 15.0 : 8.0;
        const tax = +(subtotal * 0.064).toFixed(2);
        const total = +(subtotal + shippingCost + tax).toFixed(2);

        const order = await Order.create({
            customer,
            items,
            subtotal,
            shippingCost,
            tax,
            total,
            shippingMethod,
            deliveryAddress,
            paymentMethod,
            notes
        });

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// UPDATE order status (admin/staff)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { orderNumber: req.params.orderNumber },
            { status },
            { new: true }
        ).populate('customer', 'fullName email');
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};