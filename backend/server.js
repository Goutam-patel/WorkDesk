require('dotenv').config({ override: true });

const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WorkDesk backend is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/auth', authRoutes);
app.use('/leads', leadRoutes);
app.use('/tasks', taskRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

async function startServer() {
  await connectDB();

  const server = app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });

  server.on('error', async (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${port} is already in use. Stop the existing process or change PORT in backend/.env.`);
    } else {
      logger.error('Server failed to start', error);
    }

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      logger.error('Failed to close MongoDB connection after server start failure', closeError);
    }

    process.exit(1);
  });

  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    logger.error('Failed to start server', error);
    process.exit(1);
  });
}

module.exports = app;
module.exports.startServer = startServer;
