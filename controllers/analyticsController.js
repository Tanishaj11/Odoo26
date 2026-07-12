const {pool} = require("../config/db");

exports.getAnalytics = async (req, res) => {
  try {

    const fuel = await pool.query(`
      SELECT COALESCE(SUM(total_cost),0) AS fuel_cost
      FROM fuel_logs
    `);

    const expense = await pool.query(`
      SELECT COALESCE(SUM(amount),0) AS operational_cost
      FROM expenses
    `);

    const trips = await pool.query(`
      SELECT COUNT(*) AS total_trips
      FROM trips
    `);

    res.json({
      fuelCost: fuel.rows[0].fuel_cost,
      operationalCost: expense.rows[0].operational_cost,
      totalTrips: trips.rows[0].total_trips
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};