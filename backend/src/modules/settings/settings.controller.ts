import { Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class SettingsController {
  private service = new SettingsService();

  // Config
  getConfig = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const config = await this.service.getConfig();
      res.status(200).json({ data: config });
    } catch (err) {
      next(err);
    }
  };

  updateConfig = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const config = await this.service.updateConfig(req.body);
      res.status(200).json({ message: 'Configuration updated successfully', data: config });
    } catch (err) {
      next(err);
    }
  };

  // Departments
  getDepartments = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const depts = await this.service.getDepartments();
      res.status(200).json({ data: depts });
    } catch (err) {
      next(err);
    }
  };

  createDepartment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const dept = await this.service.addDepartment(req.body);
      res.status(201).json({ message: 'Department created successfully', data: dept });
    } catch (err) {
      next(err);
    }
  };

  updateDepartment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const dept = await this.service.editDepartment(req.params.id, req.body);
      res.status(200).json({ message: 'Department updated successfully', data: dept });
    } catch (err) {
      next(err);
    }
  };

  deleteDepartment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.removeDepartment(req.params.id);
      res.status(200).json({ message: 'Department marked as inactive successfully' });
    } catch (err) {
      next(err);
    }
  };

  // Categories
  getCategories = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const cats = await this.service.getCategories();
      res.status(200).json({ data: cats });
    } catch (err) {
      next(err);
    }
  };

  createCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const cat = await this.service.addCategory(req.body);
      res.status(201).json({ message: 'Category created successfully', data: cat });
    } catch (err) {
      next(err);
    }
  };

  updateCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const cat = await this.service.editCategory(req.params.id, req.body);
      res.status(200).json({ message: 'Category updated successfully', data: cat });
    } catch (err) {
      next(err);
    }
  };
}
