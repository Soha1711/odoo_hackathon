import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const controller = new SettingsController();

// Config Router
export const settingsRouter = Router();
settingsRouter.get('/config', authMiddleware, controller.getConfig);
settingsRouter.patch('/config', authMiddleware, requireRole([Role.ADMIN]), controller.updateConfig);

// Departments Router
export const departmentsRouter = Router();
departmentsRouter.get('/', authMiddleware, controller.getDepartments);
departmentsRouter.post('/', authMiddleware, requireRole([Role.ADMIN]), controller.createDepartment);
departmentsRouter.patch('/:id', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), controller.updateDepartment);
departmentsRouter.delete('/:id', authMiddleware, requireRole([Role.ADMIN]), controller.deleteDepartment);

// Categories Router
export const categoriesRouter = Router();
categoriesRouter.get('/', authMiddleware, controller.getCategories);
categoriesRouter.post('/', authMiddleware, requireRole([Role.ADMIN]), controller.createCategory);
categoriesRouter.patch('/:id', authMiddleware, requireRole([Role.ADMIN]), controller.updateCategory);
