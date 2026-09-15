const express = require('express');
const router = express.Router();
const { getCompanySettings, updateCompanySettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/company', protect, getCompanySettings);
router.put('/company', protect, authorize('admin'), updateCompanySettings);

module.exports = router;