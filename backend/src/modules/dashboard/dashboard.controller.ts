import { Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class DashboardController {
  private service = new DashboardService();

  getSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { departmentId } = req.query;
      const data = await this.service.getDashboardSummary(departmentId as string);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  };
}
