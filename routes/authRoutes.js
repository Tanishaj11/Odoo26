const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', authenticate, getProfile);

module.exports = router;
