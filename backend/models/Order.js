const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    sku: String,
    price: Number,
    qty: { type: Number, required: true, min: 1 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: Number, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingMethod: { type: String, default: 'Standard' },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    notes: String,
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending'
    }
}, { timestamps: true });

// Auto-increment orderNumber starting at 10001
OrderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastOrder = await this.constructor.findOne().sort({ orderNumber: -1 });
        this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 10001;
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);