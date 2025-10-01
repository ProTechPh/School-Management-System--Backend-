import { Router } from 'express';
import { SubjectController } from './subject.controller';
import { authenticate } from '../../middleware/auth';
import { requireAdmin, requireTeacher } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  createSubjectSchema,
  updateSubjectSchema,
  getSubjectSchema,
  getSubjectsSchema,
  deleteSubjectSchema,
} from './subject.schemas';

const router = Router();
const subjectController = new SubjectController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Subject management endpoints
 */

// GET /subjects - Get all subjects
router.get('/', validate(getSubjectsSchema), subjectController.getSubjects);

// GET /subjects/:id - Get subject by ID
router.get('/:id', validate(getSubjectSchema), subjectController.getSubjectById);

// POST /subjects - Create new subject (Admin/Teacher only)
router.post('/', requireTeacher, validate(createSubjectSchema), subjectController.createSubject);

// PATCH /subjects/:id - Update subject (Admin/Teacher only)
router.patch('/:id', requireTeacher, validate(updateSubjectSchema), subjectController.updateSubject);

// DELETE /subjects/:id - Delete subject (Admin only)
router.delete('/:id', requireAdmin, validate(deleteSubjectSchema), subjectController.deleteSubject);

export default router;

