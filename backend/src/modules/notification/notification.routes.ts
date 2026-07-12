import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new NotificationController();

router.get('/', authMiddleware, controller.getNotifications);
router.patch('/read-all', authMiddleware, controller.markAllAsRead);
router.patch('/:id/read', authMiddleware, controller.markAsRead);

export default router;
