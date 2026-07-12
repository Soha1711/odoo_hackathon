import { Response, NextFunction } from 'express';
import { SocialService } from './social.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class SocialController {
  private service = new SocialService();

  // CSR Activities
  getActivities = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const activities = await this.service.getActivities();
      res.status(200).json({ data: activities });
    } catch (err) {
      next(err);
    }
  };

  createActivity = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const activity = await this.service.addActivity(req.body);
      res.status(201).json({ message: 'CSR Activity created successfully', data: activity });
    } catch (err) {
      next(err);
    }
  };

  // Employee Participations
  getParticipations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userId, approvalStatus } = req.query;
      const participations = await this.service.getParticipations({
        userId: userId as string,
        approvalStatus: approvalStatus as any,
      });
      res.status(200).json({ data: participations });
    } catch (err) {
      next(err);
    }
  };

  joinActivity = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const { proofUrl } = req.body;
      const participation = await this.service.joinActivity(req.user.id, req.params.id, proofUrl);
      return res.status(201).json({ message: 'Participation proof submitted successfully', data: participation });
    } catch (err) {
      return next(err);
    }
  };

  approveParticipation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { approvalStatus, pointsEarned } = req.body;
      const result = await this.service.reviewParticipation(req.params.id, approvalStatus, pointsEarned);
      res.status(200).json({ message: `Participation was successfully ${approvalStatus.toLowerCase()}`, data: result });
    } catch (err) {
      next(err);
    }
  };
}
