import { RequestHandler } from 'express';
import { AuthRequest } from './auth';
import { CustomError } from './errorHandler';

export const requireRoles = (...roles: string[]): RequestHandler => {
  return (req: AuthRequest, res, Response, next) => {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError('Insufficient permissions', 403);
    }

    next();
  };
};

export const requireAdmin = requireRoles('ADMIN');
export const requireTeacher = requireRoles('TEACHER', 'ADMIN');
export const requireStudent = requireRoles('STUDENT', 'ADMIN');
export const requireParent = requireRoles('PARENT', 'ADMIN');

