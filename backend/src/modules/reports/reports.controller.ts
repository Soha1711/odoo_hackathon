import { Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ReportsController {
  private service = new ReportsService();

  generateReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { departmentId, startDate, endDate, module } = req.query;
      const data = await this.service.compileReport({
        departmentId: departmentId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        module: module as string,
      });
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  };
}
