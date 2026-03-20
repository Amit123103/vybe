import express from 'express';
import { getMessages, getConversations, markAsRead } from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.put('/:userId/read', protect, markAsRead);

export default router;
