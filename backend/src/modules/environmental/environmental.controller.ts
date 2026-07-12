import { Response, NextFunction } from 'express';
import { EnvironmentalService } from './environmental.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class EnvironmentalController {
  private service = new EnvironmentalService();

  // Emission Factors
  getFactors = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const factors = await this.service.getFactors();
      res.status(200).json({ data: factors });
    } catch (err) {
      next(err);
    }
  };

  createFactor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const factor = await this.service.addFactor(req.body);
      res.status(201).json({ message: 'Emission factor created successfully', data: factor });
    } catch (err) {
      next(err);
    }
  };

  // Product ESG Profiles
  getProfiles = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profiles = await this.service.getProfiles();
      res.status(200).json({ data: profiles });
    } catch (err) {
      next(err);
    }
  };

  createProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await this.service.addProfile(req.body);
      res.status(201).json({ message: 'Product ESG profile created successfully', data: profile });
    } catch (err) {
      next(err);
    }
  };

  // Carbon Transactions
  getTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { departmentId, sourceType } = req.query;
      const transactions = await this.service.getTransactions({
        departmentId: departmentId as string,
        sourceType: sourceType as any,
      });
      res.status(200).json({ data: transactions });
    } catch (err) {
      next(err);
    }
  };

  createTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.service.logTransaction(req.body);
      res.status(201).json({ message: 'Carbon transaction logged successfully', data: transaction });
    } catch (err) {
      next(err);
    }
  };

  // Environmental Goals
  getGoals = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { departmentId } = req.query;
      const goals = await this.service.getGoals(departmentId as string);
      res.status(200).json({ data: goals });
    } catch (err) {
      next(err);
    }
  };

  createGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const goal = await this.service.addGoal(req.body);
      res.status(201).json({ message: 'Environmental goal created successfully', data: goal });
    } catch (err) {
      next(err);
    }
  };

  updateGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { currentValue } = req.body;
      const goal = await this.service.updateGoal(req.params.id, currentValue);
      res.status(200).json({ message: 'Environmental goal updated successfully', data: goal });
    } catch (err) {
      next(err);
    }
  };
}
