import express from 'express';
import { uploadProfileImage, handleProfileImageUpload, uploadPostImage, handlePostImageUpload } from '../controllers/uploadController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Upload profile image
router.post('/api/upload/profile-image', authMiddleware, uploadProfileImage, handleProfileImageUpload);

// Upload post image
router.post('/api/upload/post-image', authMiddleware, uploadPostImage, handlePostImageUpload);

export default router;