require('dotenv').config();

const app = require('./app');
const { pool, testConnection } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await testConnection();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await pool.end();
        console.log('Database pool closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
