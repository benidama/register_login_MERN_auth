import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';

await connectDB();

const user = await User.findOne({ email: 'jbenimana5@gmail.com' });
if (user) {
    const hashedPassword = await bcrypt.hash('beni', 12);
    user.password = hashedPassword;
    await user.save();
    console.log('Password updated successfully');
} else {
    console.log('User not found');
}

process.exit(0);