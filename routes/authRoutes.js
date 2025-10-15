import express from 'express';
import { register, verifyOTP, resendOTP, login, logout, requestPasswordReset, resetPassword, updateProfile, dashboard, clientDashboard, workerDashboard, leaderDashboard } from '../controllers/authController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Authentication routes
router.post('/api/auth/register', register);
router.get('/api/auth/register', (req, res) => res.json({ message: 'Register endpoint is working. Use POST method to register.' }));
router.post('/api/auth/verify-otp', verifyOTP);
router.post('/api/auth/resend-otp', resendOTP);
router.post('/api/auth/login', login);
router.post('/api/auth/logout', logout);
router.post('/api/auth/request-password-reset', requestPasswordReset);
router.post('/api/auth/reset-password', resetPassword);
router.put('/api/auth/update-profile', authMiddleware, updateProfile);

// Dashboard routes
router.get('/api/dashboard', authMiddleware, dashboard);
router.get('/api/client-dashboard', authMiddleware, clientDashboard);
router.get('/api/worker-dashboard', authMiddleware, workerDashboard);
router.get('/api/leader-dashboard', authMiddleware, leaderDashboard);



export default router;

