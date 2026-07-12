const express = require('express');
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const driverRoutes = require('./driverRoutes');
const tripRoutes = require('./tripRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const fuelLogRoutes = require('./fuelLogRoutes');
const expenseRoutes = require('./expenseRoutes');

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
