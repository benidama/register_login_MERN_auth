import express from 'express';
import { uploadProfileImage, handleProfileImageUpload, uploadPostImage, handlePostImageUpload, uploadMultipleImages, handleMultipleImagesUpload } from '../controllers/uploadController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Upload profile image
router.post('/api/upload/profile-image', authMiddleware, uploadProfileImage, handleProfileImageUpload);

// Upload post image
router.post('/api/upload/post-image', authMiddleware, uploadPostImage, handlePostImageUpload);

// Upload multiple images
router.post('/api/upload/images', authMiddleware, uploadMultipleImages, handleMultipleImagesUpload);

// Test endpoints without authentication (for testing only)
router.post('/api/test/upload/profile-image', uploadProfileImage, handleProfileImageUpload);
router.post('/api/test/upload/post-image', uploadPostImage, handlePostImageUpload);
router.post('/api/test/upload/images', uploadMultipleImages, handleMultipleImagesUpload);

export default router;