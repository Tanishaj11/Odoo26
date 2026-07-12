const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const availableVehicles = await db.query(
      "SELECT COUNT(*) FROM vehicles WHERE status='Available'"
    );

    const activeTrips = await db.query(
      "SELECT COUNT(*) FROM trips WHERE status='In Progress'"
    );

    const maintenance = await db.query(
      "SELECT COUNT(*) FROM vehicles WHERE status='In Maintenance'"
    );

    const availableDrivers = await db.query(
      "SELECT COUNT(*) FROM drivers WHERE status='Available'"
    );

    res.json({
      availableVehicles: availableVehicles.rows[0].count,
      activeTrips: activeTrips.rows[0].count,
      maintenanceVehicles: maintenance.rows[0].count,
      availableDrivers: availableDrivers.rows[0].count
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};