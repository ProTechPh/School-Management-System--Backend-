import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { authRateLimit } from '../../middleware/rateLimit';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.schemas';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

// Apply rate limiting to auth routes
router.use(authRateLimit);

// POST /auth/register - Register new user
router.post('/register', validate(registerSchema), authController.register);

// POST /auth/login - Login user
router.post('/login', validate(loginSchema), authController.login);

// POST /auth/refresh - Refresh access token
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// POST /auth/forgot-password - Request password reset
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// POST /auth/reset-password - Reset password with token
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes (require authentication)
router.use(authenticate);

// POST /auth/logout - Logout user
router.post('/logout', authController.logout);

// POST /auth/change-password - Change password
router.post('/change-password', validate(changePasswordSchema), authController.changePassword);

export default router;

