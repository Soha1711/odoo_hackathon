import { Router } from 'express';
import { SocialController } from './social.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { CreateCsrActivitySchema, SubmitParticipationSchema, ApproveParticipationSchema } from './social.validator';
import { Role } from '@prisma/client';

const router = Router();
const controller = new SocialController();

// Activities
router.get('/activities', authMiddleware, controller.getActivities);
router.post('/activities', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateCsrActivitySchema), controller.createActivity);

// Participations
router.get('/participations', authMiddleware, controller.getParticipations);
router.post('/activities/:id/join', authMiddleware, requireRole([Role.CONTRIBUTOR]), validateRequest(SubmitParticipationSchema), controller.joinActivity);
router.patch('/participations/:id/approve', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(ApproveParticipationSchema), controller.approveParticipation);

export default router;
