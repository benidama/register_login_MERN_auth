import express from 'express';
import { register, verifyOTP, resendOTP, login, logout, requestPasswordReset, resetPassword, updateProfile, dashboard, clientDashboard, workerDashboard, leaderDashboard } from '../controllers/authController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/register', (req, res) => res.json({ message: 'Register endpoint is working. Use POST method to register.' }));
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/update-profile', authMiddleware, updateProfile);
router.get('/dashboard', authMiddleware, dashboard);
router.get('/client-dashboard', authMiddleware, clientDashboard);
router.get('/worker-dashboard', authMiddleware, workerDashboard);
router.get('/leader-dashboard', authMiddleware, leaderDashboard);



export default router;

