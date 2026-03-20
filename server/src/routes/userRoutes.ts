import express from 'express';
import { getUserProfile, followUser, searchUsers } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/:username', getUserProfile);
router.post('/:id/follow', protect, followUser);

export default router;
