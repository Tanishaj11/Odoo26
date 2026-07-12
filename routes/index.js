const express = require('express');
const authRoutes = require('./authRoutes');
const driverRoutes = require('./driverRoutes');
const expenseRoutes = require('./expenseRoutes');
const fuelLogRoutes = require('./fuelLogRoutes');
const healthRoutes = require('./healthRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const tripRoutes = require('./tripRoutes');
const vehicleRoutes = require('./vehicleRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(healthRoutes);
router.use(vehicleRoutes);
router.use(driverRoutes);
router.use(tripRoutes);
router.use(maintenanceRoutes);
router.use(fuelLogRoutes);
router.use(expenseRoutes);

module.exports = router;
