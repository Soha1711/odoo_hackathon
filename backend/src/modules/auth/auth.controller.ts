import { Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AuthController {
  private authService = new AuthService();

  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, departmentId, role } = req.body;
      const { user, token } = await this.authService.register({
        email,
        passwordHash: password, // Named passwordHash in DTO
        firstName,
        lastName,
        departmentId,
        role,
      });

      return res.status(201).json({
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            departmentId: user.departmentId,
            xpBalance: user.xpBalance,
            pointsBalance: user.pointsBalance,
          },
        },
      });
    } catch (err) {
      return next(err);
    }
  };

  login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);

      return res.status(200).json({
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            departmentId: user.departmentId,
            xpBalance: user.xpBalance,
            pointsBalance: user.pointsBalance,
          },
        },
      });
    } catch (err) {
      return next(err);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const user = await this.authService.getUserById(req.user.id);
      return res.status(200).json({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          departmentId: user.departmentId,
          xpBalance: user.xpBalance,
          pointsBalance: user.pointsBalance,
          department: user.department,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
}
