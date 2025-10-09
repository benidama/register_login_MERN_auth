import express from 'express';
import { register, verifyOTP, resendOTP, login, logout, requestPasswordReset, resetPassword, updateProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/update-profile', authMiddleware, updateProfile);


export default router;

