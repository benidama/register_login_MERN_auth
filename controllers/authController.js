import User from '../models/User.js';
import { createTransport } from 'nodemailer';
import { randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';


dotenv.config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required');
}

// Email Transporter Setup
const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true,
    port: 465
});

// Generate OTP
const generateOTP = () => randomInt(100000, 999999).toString();

// Register User and Send OTP
export async function register(req, res) {
    try {
        const { name, email, phone, password, role } = req.body;
        
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        console.log('Received role:', role, 'Type:', typeof role);
        if (!['Client', 'Worker', 'Leader'].includes(role)) {
            return res.status(400).json({ message: `Invalid role selected. Received: '${role}'. Expected: Client, Worker, or Leader` });
        }
        
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = new User({ name, email, phone, password: hashedPassword, role, otp, otpExpiry });
        await newUser.save();

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP is: ${otp}`
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            try {
                await User.findByIdAndDelete(newUser._id);
            } catch (deleteError) {
                console.error('Failed to delete user during cleanup:', deleteError);
            }
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.status(201).json({ message: 'User registered. Please verify OTP sent to email.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
}

// Verify OTP
export async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await User.findByIdAndUpdate(user._id, {
            isVerified: true,
            $unset: { otp: 1, otpExpiry: 1 }
        }, { runValidators: false });

        res.json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
}

// Resend OTP
export async function resendOTP(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Resend OTP Verification',
                text: `Your new OTP is: ${otp}`
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.json({ message: 'OTP resent successfully.' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Error resending OTP' });
    }
}

// Login User

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Email not verified. Please verify OTP.' });
        }

        req.session.user = { id: user._id, email: user.email, name: user.name, phone: user.phone, role: user.role };
        res.json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
}

// Logout User
export function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie(process.env.SESSION_COOKIE_NAME || 'connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
}

// Request Password Reset
export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await User.findByIdAndUpdate(user._id, {
            otp,
            otpExpiry
        }, { runValidators: false });

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset OTP',
                text: `Your password reset OTP is: ${otp}`
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ message: 'Failed to send reset email' });
        }

        res.json({ message: 'Password reset OTP sent to email' });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ message: 'Error requesting password reset' });
    }
}

// Reset Password
export async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            $unset: { otp: 1, otpExpiry: 1 }
        }, { runValidators: false });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
}

// Update User Profile
export async function updateProfile(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { name, phone, role } = req.body;
        const userId = req.session.user.id;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (role && ['Client', 'Worker', 'Leader'].includes(role)) updateData.role = role;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { 
            new: true, 
            runValidators: true 
        }).select('-password -otp -otpExpiry');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.session.user = { 
            id: updatedUser._id, 
            email: updatedUser.email, 
            name: updatedUser.name, 
            phone: updatedUser.phone, 
            role: updatedUser.role 
        };

        res.json({ 
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error updating profile' });
    }
}



// Dashboard (Protected Route)
export async function dashboard(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        res.json({ 
            message: `Welcome to the dashboard, ${req.session.user.name}`,
            user: req.session.user
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Error accessing dashboard' });
    }
}

// Client Dashboard
export async function clientDashboard(req, res) {
    try {
        if (!req.session.user || req.session.user.role !== 'Client') {
            return res.status(403).json({ message: 'Access denied. Client role required.' });
        }
        res.json({ 
            message: `Welcome to Client Dashboard, ${req.session.user.name}`,
            role: 'Client',
            features: ['View Services', 'Book Appointments', 'Track Orders']
        });
    } catch (error) {
        console.error('Client dashboard error:', error);
        res.status(500).json({ message: 'Error accessing client dashboard' });
    }
}

// Worker Dashboard
export async function workerDashboard(req, res) {
    try {
        if (!req.session.user || req.session.user.role !== 'Worker') {
            return res.status(403).json({ message: 'Access denied. Worker role required.' });
        }
        res.json({ 
            message: `Welcome to Worker Dashboard, ${req.session.user.name}`,
            role: 'Worker',
            features: ['Manage Tasks', 'Update Status', 'View Assignments']
        });
    } catch (error) {
        console.error('Worker dashboard error:', error);
        res.status(500).json({ message: 'Error accessing worker dashboard' });
    }
}

// Leader Dashboard
export async function leaderDashboard(req, res) {
    try {
        if (!req.session.user || req.session.user.role !== 'Leader') {
            return res.status(403).json({ message: 'Access denied. Leader role required.' });
        }
        res.json({ 
            message: `Welcome to Leader Dashboard, ${req.session.user.name}`,
            role: 'Leader',
            features: ['Manage Team', 'View Reports', 'Assign Tasks', 'Monitor Performance']
        });
    } catch (error) {
        console.error('Leader dashboard error:', error);
        res.status(500).json({ message: 'Error accessing leader dashboard' });
    }
}
 