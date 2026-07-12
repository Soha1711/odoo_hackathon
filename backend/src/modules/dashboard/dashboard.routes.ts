import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new DashboardController();

router.get('/summary', authMiddleware, controller.getSummary);

export default router;
