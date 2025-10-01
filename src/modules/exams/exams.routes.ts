import { Router } from 'express';
import { ExamsController } from './exams.controller';
import { authenticate } from '../../middleware/auth';
import { requireAdmin, requireTeacher } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  createExamSchema,
  updateExamSchema,
  getExamSchema,
  getExamsSchema,
  deleteExamSchema,
  createGradeSchema,
  getGradesSchema,
  getExamGradesSchema,
  getStudentGradesSchema,
} from './exams.schemas';

const router = Router();
const examsController = new ExamsController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Exam management endpoints
 */

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Grade management endpoints
 */

// Exam routes
// GET /exams - Get all exams
router.get('/', validate(getExamsSchema), examsController.getExams);

// GET /exams/:id - Get exam by ID
router.get('/:id', validate(getExamSchema), examsController.getExamById);

// GET /exams/:id/grades - Get grades for a specific exam
router.get('/:id/grades', validate(getExamGradesSchema), examsController.getExamGrades);

// POST /exams - Create new exam (Admin/Teacher only)
router.post('/', requireTeacher, validate(createExamSchema), examsController.createExam);

// PATCH /exams/:id - Update exam (Admin/Teacher only)
router.patch('/:id', requireTeacher, validate(updateExamSchema), examsController.updateExam);

// DELETE /exams/:id - Delete exam (Admin only)
router.delete('/:id', requireAdmin, validate(deleteExamSchema), examsController.deleteExam);

// Grade routes
// GET /grades - Get all grades
router.get('/grades', validate(getGradesSchema), examsController.getGrades);

// GET /grades/student - Get grades for a specific student
router.get('/grades/student', validate(getStudentGradesSchema), examsController.getStudentGrades);

// POST /grades - Create new grade (Admin/Teacher only)
router.post('/grades', requireTeacher, validate(createGradeSchema), examsController.createGrade);

export default router;