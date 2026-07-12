require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const tripRoutes = require("./routes/tripRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const fuelLogRoutes = require("./routes/fuelLogRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const healthRoutes = require("./routes/healthRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/drivers", driverRoutes);
app.use("/trips", tripRoutes);
app.use("/maintenance", maintenanceRoutes);
app.use("/fuel-logs", fuelLogRoutes);
app.use("/expenses", expenseRoutes);
app.use("/health", healthRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/analytics", analyticsRoutes);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
