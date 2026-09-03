const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    addProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

// Import the protection middleware
const { protect } = require('../middleware/authMiddleware');

// Define the routes
router.get('/', protect, getProducts);
router.post('/', protect, addProduct);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;