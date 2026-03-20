import express from 'express';
import { createPost, getFeed, likePost, getPostById } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getFeed);
router.post('/', protect, createPost);
router.get('/:id', getPostById);
router.post('/:id/like', protect, likePost);

export default router;
