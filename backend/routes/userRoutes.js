const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUserRole, 
    deleteUser,
    updateOwnProfile,
    updateOwnPassword
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// These must come BEFORE /:id routes, otherwise Express treats "me" as an :id param
router.put('/me/profile', protect, updateOwnProfile);
router.put('/me/password', protect, updateOwnPassword);

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.post('/', protect, authorize('admin'), createUser);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;