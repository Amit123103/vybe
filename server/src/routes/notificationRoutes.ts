import express from 'express';
import { getNotifications, markAllAsRead } from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/read', protect, markAllAsRead);

export default router;
