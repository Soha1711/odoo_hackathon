import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/prisma';

export class NotificationController {
  getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const notifications = await prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ data: notifications });
    } catch (err) {
      return next(err);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const notification = await prisma.notification.findFirst({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!notification) {
        return res.status(404).json({ error: { message: 'Notification not found' } });
      }

      const updated = await prisma.notification.update({
        where: { id: req.params.id },
        data: { isRead: true },
      });

      return res.status(200).json({ message: 'Notification marked as read', data: updated });
    } catch (err) {
      return next(err);
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      await prisma.notification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true },
      });

      return res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
      return next(err);
    }
  };
}
