const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const RANGE_DAYS = { "7D": 7, "30D": 30, "90D": 90, "1Y": 365 };

exports.getAnalytics = async (req, res) => {
    try {
        const range = req.query.range || "30D";
        const days = RANGE_DAYS[range] || 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const ordersInRange = await Order.find({ createdAt: { $gte: startDate } });

        // 1. KPIs
        const revenue = ordersInRange.reduce((sum, o) => sum + o.total, 0);
        const orderCount = ordersInRange.length;
        const aov = orderCount > 0 ? revenue / orderCount : 0;
        // "Return rate" proxy: orders that were never delivered as a % (placeholder, since there's no returns model yet)
        const undeliveredCount = ordersInRange.filter(o => o.status !== "Delivered").length;
        const returnRate = orderCount > 0 ? ((undeliveredCount / orderCount) * 100).toFixed(1) : "0.0";

        // 2. Revenue trend - bucketed by day/week/month depending on range
        let bucketFormat;
        if (days <= 7) bucketFormat = "day";
        else if (days <= 30) bucketFormat = "week";
        else if (days <= 90) bucketFormat = "month";
        else bucketFormat = "quarter";

        const revenueTrend = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id:
                        bucketFormat === "day"
                            ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                            : bucketFormat === "week"
                            ? { $week: "$createdAt" }
                            : bucketFormat === "month"
                            ? { $month: "$createdAt" }
                            : { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } },
                    value: { $sum: "$total" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const revenueTrendFormatted = revenueTrend.map((r, i) => ({
            label:
                bucketFormat === "day"
                    ? new Date(r._id).toLocaleDateString("en-US", { weekday: "short" })
                    : bucketFormat === "week"
                    ? `Week ${i + 1}`
                    : bucketFormat === "month"
                    ? new Date(2000, r._id - 1).toLocaleDateString("en-US", { month: "short" })
                    : `Q${r._id}`,
            value: Math.round(r.value)
        }));

        // 3. Warehouse performance - total stock per warehouse location (proxy, since orders don't track warehouse)
        const warehouseAgg = await Product.aggregate([
            { $group: { _id: "$warehouseLocation", value: { $sum: "$quantity" } } },
            { $sort: { value: -1 } }
        ]);
        const warehouseData = warehouseAgg.map(w => ({ name: w._id || "Unassigned", value: w.value }));

        // 4. Top products by revenue - computed from order items across the selected range
        const productRevenue = {};
        ordersInRange.forEach(o => {
            o.items.forEach(item => {
                const key = item.name;
                if (!productRevenue[key]) productRevenue[key] = { units: 0, revenue: 0 };
                productRevenue[key].units += item.qty;
                productRevenue[key].revenue += item.price * item.qty;
            });
        });
        const topProducts = Object.entries(productRevenue)
            .map(([name, data]) => ({ name, units: data.units, revenue: `$${data.revenue.toFixed(2)}` }))
            .sort((a, b) => parseFloat(b.revenue.slice(1)) - parseFloat(a.revenue.slice(1)))
            .slice(0, 5);

        // 5. Customer segments - based on total lifetime order count per customer
        const allOrders = await Order.find().select('customer');
        const orderCountByCustomer = {};
        allOrders.forEach(o => {
            const id = o.customer.toString();
            orderCountByCustomer[id] = (orderCountByCustomer[id] || 0) + 1;
        });
        let newCustomers = 0, returning = 0, vip = 0;
        Object.values(orderCountByCustomer).forEach(count => {
            if (count === 1) newCustomers++;
            else if (count < 10) returning++;
            else vip++;
        });
        const totalCustomersWithOrders = newCustomers + returning + vip;
        const segments = totalCustomersWithOrders > 0 ? [
            { name: "New customers", value: Math.round((newCustomers / totalCustomersWithOrders) * 100), color: "#DCE9FD" },
            { name: "Returning", value: Math.round((returning / totalCustomersWithOrders) * 100), color: "#5C90F2" },
            { name: "VIP (10+ orders)", value: Math.round((vip / totalCustomersWithOrders) * 100), color: "#2F6FED" }
        ] : [];

        res.status(200).json({
            kpi: {
                revenue: `$${revenue.toFixed(2)}`,
                orders: orderCount,
                aov: `$${aov.toFixed(2)}`,
                returnRate: `${returnRate}%`
            },
            revenueTrend: revenueTrendFormatted,
            warehouseData,
            topProducts,
            segments
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};