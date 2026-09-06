const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ["https://stockflow-wms.netlify.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Example of how it will look later:
const { protect } = require('./middleware/authMiddleware');

// Only protected users can access products
app.use('/api/products', protect, require('./routes/productRoutes'));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));


// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ DB Connected Successfully"))
    .catch(err => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));