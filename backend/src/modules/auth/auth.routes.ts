import { Router } from 'express';
import { AuthController } from './auth.controller';
import { RegisterSchema, LoginSchema } from './auth.validator';
import { validateRequest } from '../../middleware/validation.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', validateRequest(RegisterSchema), controller.register);
router.post('/login', validateRequest(LoginSchema), controller.login);
router.get('/me', authMiddleware, controller.getMe);

export default router;
