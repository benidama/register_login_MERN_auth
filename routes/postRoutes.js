import express from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../controllers/postController.js';
import { uploadMultipleImages } from '../controllers/uploadController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/api/posts', authMiddleware, uploadMultipleImages, createPost);
router.get('/api/posts', getAllPosts);
router.get('/api/posts/:id', getPostById);
router.put('/api/posts/:id', authMiddleware, uploadMultipleImages, updatePost);
router.delete('/api/posts/:id', authMiddleware, deletePost);

export default router;