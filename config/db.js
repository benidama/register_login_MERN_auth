import { connect } from 'mongoose';
import User from '../models/User.js';

const MONGO_URI = "mongodb+srv://benidama:Estote22@cluster0.53bfwb8.mongodb.net";

const connectDB = async () => {
  try {
    await connect(MONGO_URI);
    console.log('MongoDB Connected Successfully');

    await User.createCollection();
    console.log('User collection created successfully');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

connectDB();

export default connectDB;
