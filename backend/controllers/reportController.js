const Order = require('../models/Order');
const Product = require('../models/Product');

// GET dashboard-style report data (admin/staff)
exports.getReportsSummary = async (req, res) => {
    try {
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        // 1. KPI: Total orders, avg fulfillment time proxy, order accuracy proxy, stockout count
        const totalOrders = await Order.countDocuments();
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
        const stockoutCount = await Product.countDocuments({ quantity: { $lte: 0 } });

        // Simple "order accuracy" proxy: % of orders not left Pending for very long (placeholder metric)
        const orderAccuracy = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : "0.0";

        // 2. Orders fulfilled per month (last 6 months) - for line chart
        const ordersByMonth = await Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const fulfillmentLabels = [];
        const fulfillmentData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(now.getMonth() - i);
            const label = monthNames[d.getMonth()];
            const match = ordersByMonth.find(o => o._id.month === d.getMonth() + 1 && o._id.year === d.getFullYear());
            fulfillmentLabels.push(label);
            fulfillmentData.push(match ? match.count : 0);
        }

        // 3. Inventory by category (doughnut chart)
        const inventoryByCategory = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: "$quantity" } } },
            { $sort: { count: -1 } }
        ]);
        const categoryLabels = inventoryByCategory.map(c => c._id || "Uncategorized");
        const categoryData = inventoryByCategory.map(c => c.count);

        // 4. Warehouse comparison (bar chart) - orders grouped by delivery address's first word as a simple proxy
        // Since there's no dedicated warehouse field on Order, group by product's warehouseLocation instead
        const warehouseAgg = await Product.aggregate([
            { $group: { _id: "$warehouseLocation", totalStock: { $sum: "$quantity" } } },
            { $sort: { totalStock: -1 } }
        ]);
        const warehouseLabels = warehouseAgg.map(w => w._id || "Unassigned");
        const warehouseData = warehouseAgg.map(w => w.totalStock);

        res.status(200).json({
            kpis: {
                totalOrders,
                orderAccuracy: `${orderAccuracy}%`,
                stockoutCount,
                deliveredOrders
            },
            fulfillmentChart: { labels: fulfillmentLabels, data: fulfillmentData },
            categoryChart: { labels: categoryLabels, data: categoryData },
            warehouseChart: { labels: warehouseLabels, data: warehouseData }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};