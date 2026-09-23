const express = require('express');
const router = express.Router();
const { getMySavedItems, addSavedItem, removeSavedItem } = require('../controllers/savedItemController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMySavedItems);
router.post('/', protect, addSavedItem);
router.delete('/:productId', protect, removeSavedItem);

module.exports = router;