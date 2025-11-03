import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection Configuration
const connectDB = async () => {
  try {
    console.log('🔍 Checking MongoDB URI from environment...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'UNDEFINED');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.log('Available environment variables:', Object.keys(process.env));
      throw new Error('MONGODB_URI is not defined');
    }

    // Default connection options
    const options = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      maxPoolSize: 50,
      minPoolSize: 5,
      autoIndex: true,
      maxConnecting: 10,
      heartbeatFrequencyMS: 10000,
    };

    // Set mongoose global options
    mongoose.set('bufferCommands', true);
    mongoose.set('bufferTimeoutMS', 60000);

    console.log('🔄 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log('📊 Database connection parameters configured');
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        connectDB();
      }, 5000);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully!');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('Please check your MongoDB Atlas network settings and ensure your IP is whitelisted.');
    console.log('Visit: https://www.mongodb.com/docs/atlas/security-whitelist/');
    
    // Don't exit the process, let it retry
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;