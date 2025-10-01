import { Router } from 'express';
import { EnrollmentController } from './enrollment.controller';
import { authenticate } from '../../middleware/auth';
import { requireAdmin, requireTeacher } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  getEnrollmentSchema,
  getEnrollmentsSchema,
  deleteEnrollmentSchema,
  addSubjectToEnrollmentSchema,
  removeSubjectFromEnrollmentSchema,
} from './enrollment.schemas';

const router = Router();
const enrollmentController = new EnrollmentController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enrollment management endpoints
 */

// GET /enrollments - Get all enrollments
router.get('/', validate(getEnrollmentsSchema), enrollmentController.getEnrollments);

// GET /enrollments/:id - Get enrollment by ID
router.get('/:id', validate(getEnrollmentSchema), enrollmentController.getEnrollmentById);

// POST /enrollments - Create new enrollment (Admin/Teacher only)
router.post('/', requireTeacher, validate(createEnrollmentSchema), enrollmentController.createEnrollment);

// PATCH /enrollments/:id - Update enrollment (Admin/Teacher only)
router.patch('/:id', requireTeacher, validate(updateEnrollmentSchema), enrollmentController.updateEnrollment);

// DELETE /enrollments/:id - Delete enrollment (Admin only)
router.delete('/:id', requireAdmin, validate(deleteEnrollmentSchema), enrollmentController.deleteEnrollment);

// POST /enrollments/:id/subjects - Add subject to enrollment (Admin/Teacher only)
router.post('/:id/subjects', requireTeacher, validate(addSubjectToEnrollmentSchema), enrollmentController.addSubjectToEnrollment);

// DELETE /enrollments/:id/subjects/:subjectId - Remove subject from enrollment (Admin/Teacher only)
router.delete('/:id/subjects/:subjectId', requireTeacher, validate(removeSubjectFromEnrollmentSchema), enrollmentController.removeSubjectFromEnrollment);

export default router;