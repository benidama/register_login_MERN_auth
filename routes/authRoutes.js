import express from 'express';
import { register, verifyOTP, resendOTP, login, logout, dashboard, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/dashboard', authMiddleware, dashboard);

export default router;

