import { Router } from 'express';
import { ClassController } from './class.controller';
import { authenticate } from '../../middleware/auth';
import { requireAdmin, requireTeacher } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  createClassSchema,
  updateClassSchema,
  getClassSchema,
  getClassesSchema,
  deleteClassSchema,
  addStudentToClassSchema,
  removeStudentFromClassSchema,
} from './class.schemas';

const router = Router();
const classController = new ClassController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management endpoints
 */

// GET /classes - Get all classes
router.get('/', validate(getClassesSchema), classController.getClasses);

// GET /classes/:id - Get class by ID
router.get('/:id', validate(getClassSchema), classController.getClassById);

// POST /classes - Create new class (Admin/Teacher only)
router.post('/', requireTeacher, validate(createClassSchema), classController.createClass);

// PATCH /classes/:id - Update class (Admin/Teacher only)
router.patch('/:id', requireTeacher, validate(updateClassSchema), classController.updateClass);

// DELETE /classes/:id - Delete class (Admin only)
router.delete('/:id', requireAdmin, validate(deleteClassSchema), classController.deleteClass);

// POST /classes/:id/students - Add student to class (Admin/Teacher only)
router.post('/:id/students', requireTeacher, validate(addStudentToClassSchema), classController.addStudentToClass);

// DELETE /classes/:id/students/:studentId - Remove student from class (Admin/Teacher only)
router.delete('/:id/students/:studentId', requireTeacher, validate(removeStudentFromClassSchema), classController.removeStudentFromClass);

export default router;

