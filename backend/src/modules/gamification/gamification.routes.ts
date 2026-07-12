import { Router } from 'express';
import { GamificationController } from './gamification.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { CreateChallengeSchema, UpdateProgressSchema, ApproveChallengeParticipationSchema, CreateRewardSchema } from './gamification.validator';
import { Role } from '@prisma/client';

const router = Router();
const controller = new GamificationController();

// Challenges
router.get('/challenges', authMiddleware, controller.getChallenges);
router.post('/challenges', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateChallengeSchema), controller.createChallenge);

// Participations
router.get('/participations', authMiddleware, controller.getParticipations);
router.post('/challenges/:id/join', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR]), controller.joinChallenge);
router.patch('/challenges/:id/progress', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR]), validateRequest(UpdateProgressSchema), controller.updateProgress);
router.patch('/participations/:id/approve', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(ApproveChallengeParticipationSchema), controller.approveParticipation);

// Badges
router.get('/badges', authMiddleware, controller.getBadges);
router.get('/badges/my', authMiddleware, controller.getMyBadges);

// Rewards
router.get('/rewards', authMiddleware, controller.getRewards);
router.post('/rewards', authMiddleware, requireRole([Role.ADMIN]), validateRequest(CreateRewardSchema), controller.createReward);
router.post('/rewards/:id/redeem', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR]), controller.redeemReward);

// Leaderboard
router.get('/leaderboard', authMiddleware, controller.getLeaderboard);

export default router;
