const { pool } = require('../config/db');

async function checkDatabaseConnection() {
  const client = await pool.connect();

  try {
    await client.query('SELECT 1');
    return { connected: true };
  } finally {
    client.release();
  }
}

module.exports = {
  checkDatabaseConnection,
};
