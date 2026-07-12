import { Response, NextFunction } from 'express';
import { GovernanceService } from './governance.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class GovernanceController {
  private service = new GovernanceService();

  // Policies
  getPolicies = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const policies = await this.service.getPolicies();
      res.status(200).json({ data: policies });
    } catch (err) {
      next(err);
    }
  };

  createPolicy = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const policy = await this.service.addPolicy(req.body);
      res.status(201).json({ message: 'Policy published successfully', data: policy });
    } catch (err) {
      next(err);
    }
  };

  acknowledgePolicy = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const ack = await this.service.acknowledgePolicy(req.params.id, req.user.id);
      return res.status(201).json({ message: 'Policy acknowledged successfully', data: ack });
    } catch (err) {
      return next(err);
    }
  };

  getAcks = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const acks = await this.service.getAcks();
      res.status(200).json({ data: acks });
    } catch (err) {
      next(err);
    }
  };

  // Audits
  getAudits = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { departmentId } = req.query;
      const audits = await this.service.getAudits(departmentId as string);
      res.status(200).json({ data: audits });
    } catch (err) {
      next(err);
    }
  };

  createAudit = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const audit = await this.service.recordAudit(req.body);
      res.status(201).json({ message: 'Audit recorded successfully', data: audit });
    } catch (err) {
      next(err);
    }
  };

  // Compliance Issues
  getIssues = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { departmentId, status } = req.query;
      const issues = await this.service.getIssues({
        departmentId: departmentId as string,
        status: status as any,
      });
      res.status(200).json({ data: issues });
    } catch (err) {
      next(err);
    }
  };

  createIssue = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const issue = await this.service.fileIssue(req.body);
      res.status(201).json({ message: 'Compliance issue recorded successfully', data: issue });
    } catch (err) {
      next(err);
    }
  };

  updateIssue = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const issue = await this.service.editIssue(req.params.id, req.body);
      res.status(200).json({ message: 'Compliance issue updated successfully', data: issue });
    } catch (err) {
      next(err);
    }
  };
}
