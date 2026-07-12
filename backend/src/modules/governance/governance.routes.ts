import { Router } from 'express';
import { GovernanceController } from './governance.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { CreatePolicySchema, CreateAuditSchema, CreateIssueSchema, UpdateIssueSchema } from './governance.validator';
import { Role } from '@prisma/client';

const router = Router();
const controller = new GovernanceController();

// Policies
router.get('/policies', authMiddleware, controller.getPolicies);
router.post('/policies', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreatePolicySchema), controller.createPolicy);
router.post('/policies/:id/acknowledge', authMiddleware, requireRole([Role.CONTRIBUTOR]), controller.acknowledgePolicy);
router.get('/acknowledgements', authMiddleware, controller.getAcks);

// Audits
router.get('/audits', authMiddleware, controller.getAudits);
router.post('/audits', authMiddleware, requireRole([Role.ADMIN]), validateRequest(CreateAuditSchema), controller.createAudit);

// Compliance Issues
router.get('/issues', authMiddleware, controller.getIssues);
router.post('/issues', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateIssueSchema), controller.createIssue);
router.patch('/issues/:id', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(UpdateIssueSchema), controller.updateIssue);

export default router;
