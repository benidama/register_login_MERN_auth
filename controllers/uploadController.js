import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Upload profile image
export const uploadProfileImage = upload.single('profileImage');

export async function handleProfileImageUpload(req, res) {
    try {
        console.log('File received:', req.file);
        console.log('Body received:', req.body);
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided. Use field name "profileImage"' });
        }

        // Convert to base64
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        res.json({
            message: 'Profile image uploaded successfully',
            imageData: base64Image
        });
    } catch (error) {
        console.error('Profile image upload error:', error);
        res.status(500).json({ message: 'Error uploading profile image' });
    }
}

// Upload post image
export const uploadPostImage = upload.single('postImage');

export async function handlePostImageUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Convert to base64
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        res.json({
            message: 'Post image uploaded successfully',
            imageData: base64Image
        });
    } catch (error) {
        console.error('Post image upload error:', error);
        res.status(500).json({ message: 'Error uploading post image' });
    }
}