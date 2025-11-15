import express from 'express';
import { createJob, getAllJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/api/jobs', authMiddleware, createJob);
router.get('/api/jobs', getAllJobs);
router.get('/api/jobs/:id', getJobById);
router.put('/api/jobs/:id', authMiddleware, updateJob);
router.delete('/api/jobs/:id', authMiddleware, deleteJob);

export default router;