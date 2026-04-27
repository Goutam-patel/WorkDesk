const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    const error = new Error('MONGODB_URI is not defined');
    logger.error(error.message);
    throw error;
  }

  const isPlaceholderUri =
    uri.includes('username:password@cluster.mongodb.net') ||
    uri.includes('cluster.mongodb.net/workdesk');

  if (isPlaceholderUri) {
    const error = new Error(
      'MONGODB_URI is using the template value. Replace it in backend/.env with your MongoDB Atlas connection string.'
    );
    logger.error(error.message);
    throw error;
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    logger.info('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed', error.message);
    throw error;
  }
}

module.exports = connectDB;
module.exports.connectDB = connectDB;
