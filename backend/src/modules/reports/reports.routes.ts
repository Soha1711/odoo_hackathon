import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new ReportsController();

router.get('/compile', authMiddleware, controller.generateReport);

export default router;
