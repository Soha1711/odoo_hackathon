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
// All authenticated users can acknowledge policies (not just CONTRIBUTORs)
router.post('/policies/:id/acknowledge', authMiddleware, controller.acknowledgePolicy);
// Match frontend API constant: ACKS = '/governance/acks'
router.get('/acks', authMiddleware, controller.getAcks);

// Audits
router.get('/audits', authMiddleware, controller.getAudits);
// Both ADMIN and MANAGER can log audits
router.post('/audits', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateAuditSchema), controller.createAudit);

// Compliance Issues
router.get('/issues', authMiddleware, controller.getIssues);
router.post('/issues', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(CreateIssueSchema), controller.createIssue);
router.patch('/issues/:id', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), validateRequest(UpdateIssueSchema), controller.updateIssue);

export default router;
