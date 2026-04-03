const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validate } = require('../middleware/validation');

router.post('/register', validateRegister, validate, registerUser);
router.post('/login', validateLogin, validate, loginUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
