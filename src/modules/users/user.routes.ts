import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  getUsersSchema,
  deleteUserSchema,
} from './user.schemas';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

// GET /users - Get all users (Admin only)
router.get('/', requireAdmin, validate(getUsersSchema), userController.getUsers);

// GET /users/:id - Get user by ID
router.get('/:id', validate(getUserSchema), userController.getUserById);

// POST /users - Create new user (Admin only)
router.post('/', requireAdmin, validate(createUserSchema), userController.createUser);

// PATCH /users/:id - Update user (Admin only)
router.patch('/:id', requireAdmin, validate(updateUserSchema), userController.updateUser);

// DELETE /users/:id - Delete user (Admin only)
router.delete('/:id', requireAdmin, validate(deleteUserSchema), userController.deleteUser);

export default router;

