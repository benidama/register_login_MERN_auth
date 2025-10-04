import { connect } from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    await connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');

    try {
      await User.createCollection();
      console.log('User collection created successfully');
    } catch (collectionErr) {
      if (!collectionErr.message?.includes('already exists')) {
        console.error('Error creating User collection:', collectionErr);
      }
    }
  } catch (err) {
    console.error('MongoDB Connection Failed:', err);
    process.exit(1);
  }
};

export default connectDB;
