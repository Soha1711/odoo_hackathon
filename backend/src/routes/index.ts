import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes';
import { settingsRouter, departmentsRouter, categoriesRouter } from '../modules/settings/settings.routes';
import environmentalRouter from '../modules/environmental/environmental.routes';
import socialRouter from '../modules/social/social.routes';
import governanceRouter from '../modules/governance/governance.routes';
import gamificationRouter from '../modules/gamification/gamification.routes';
import dashboardRouter from '../modules/dashboard/dashboard.routes';
import reportsRouter from '../modules/reports/reports.routes';
import notificationRouter from '../modules/notification/notification.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/settings', settingsRouter);
rootRouter.use('/departments', departmentsRouter);
rootRouter.use('/categories', categoriesRouter);
rootRouter.use('/environmental', environmentalRouter);
rootRouter.use('/social', socialRouter);
rootRouter.use('/governance', governanceRouter);
rootRouter.use('/gamification', gamificationRouter);
rootRouter.use('/dashboard', dashboardRouter);
rootRouter.use('/reports', reportsRouter);
rootRouter.use('/notifications', notificationRouter);

export default rootRouter;
