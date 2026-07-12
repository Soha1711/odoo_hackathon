import { Router } from 'express';
import { EnvironmentalController } from './environmental.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { CreateCarbonTransactionSchema, CreateGoalSchema, CreateFactorSchema, CreateProfileSchema } from './environmental.validator';
import { Role } from '@prisma/client';

const router = Router();
const controller = new EnvironmentalController();

// Factors
router.get('/factors', authMiddleware, controller.getFactors);
router.post('/factors', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateFactorSchema), controller.createFactor);

// Profiles
router.get('/profiles', authMiddleware, controller.getProfiles);
router.post('/profiles', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateProfileSchema), controller.createProfile);

// Transactions
router.get('/transactions', authMiddleware, controller.getTransactions);
router.post('/transactions', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateCarbonTransactionSchema), controller.createTransaction);

// Goals
router.get('/goals', authMiddleware, controller.getGoals);
router.post('/goals', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateGoalSchema), controller.createGoal);
router.patch('/goals/:id', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), controller.updateGoal);

export default router;
