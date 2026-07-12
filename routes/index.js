const express = require('express');
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(healthRoutes);

module.exports = router;
