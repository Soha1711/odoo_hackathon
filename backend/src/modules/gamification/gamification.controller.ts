import { Response, NextFunction } from 'express';
import { GamificationService } from './gamification.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class GamificationController {
  private service = new GamificationService();

  // Challenges
  getChallenges = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query;
      const challenges = await this.service.getChallenges(status as any);
      res.status(200).json({ data: challenges });
    } catch (err) {
      next(err);
    }
  };

  createChallenge = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const challenge = await this.service.addChallenge(req.body);
      res.status(201).json({ message: 'Challenge created successfully', data: challenge });
    } catch (err) {
      next(err);
    }
  };

  // Participations
  getParticipations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userId, challengeId, approvalStatus } = req.query;
      const participations = await this.service.getParticipations({
        userId: userId as string,
        challengeId: challengeId as string,
        approvalStatus: approvalStatus as any,
      });
      res.status(200).json({ data: participations });
    } catch (err) {
      next(err);
    }
  };

  joinChallenge = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }
      const participation = await this.service.joinChallenge(req.user.id, req.params.id);
      return res.status(201).json({ message: 'Successfully joined challenge', data: participation });
    } catch (err) {
      return next(err);
    }
  };

  updateProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }
      const { progress, proofUrl } = req.body;
      const result = await this.service.updateProgress(req.user.id, req.params.id, progress, proofUrl);
      return res.status(200).json({ message: 'Progress updated successfully', data: result });
    } catch (err) {
      return next(err);
    }
  };

  approveParticipation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { approvalStatus } = req.body;
      const result = await this.service.reviewParticipation(req.params.id, approvalStatus);
      res.status(200).json({ message: `Challenge completion was successfully ${approvalStatus.toLowerCase()}`, data: result });
    } catch (err) {
      next(err);
    }
  };

  // Badges
  getBadges = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const badges = await this.service.getBadges();
      res.status(200).json({ data: badges });
    } catch (err) {
      next(err);
    }
  };

  getMyBadges = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }
      const badges = await this.service.getMyBadges(req.user.id);
      return res.status(200).json({ data: badges });
    } catch (err) {
      return next(err);
    }
  };

  // Rewards
  getRewards = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const rewards = await this.service.getRewards();
      res.status(200).json({ data: rewards });
    } catch (err) {
      next(err);
    }
  };

  createReward = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const reward = await this.service.addReward(req.body);
      res.status(201).json({ message: 'Reward item created successfully', data: reward });
    } catch (err) {
      next(err);
    }
  };

  redeemReward = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }
      const result = await this.service.redeemReward(req.user.id, req.params.id);
      return res.status(201).json({ message: 'Reward redeemed successfully', data: result });
    } catch (err) {
      return next(err);
    }
  };

  // Leaderboard
  getLeaderboard = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getLeaderboards();
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}
