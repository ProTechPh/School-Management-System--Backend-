import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { authenticate } from '../../middleware/auth';
import { requireAdmin, requireTeacher } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  getAttendanceSchema,
  getAttendancesSchema,
  deleteAttendanceSchema,
  markBulkAttendanceSchema,
  getAttendanceReportSchema,
} from './attendance.schemas';

const router = Router();
const attendanceController = new AttendanceController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management endpoints
 */

// GET /attendance - Get all attendance records
router.get('/', validate(getAttendancesSchema), attendanceController.getAttendances);

// GET /attendance/report - Get attendance report
router.get('/report', validate(getAttendanceReportSchema), attendanceController.getAttendanceReport);

// GET /attendance/:id - Get attendance record by ID
router.get('/:id', validate(getAttendanceSchema), attendanceController.getAttendanceById);

// POST /attendance - Mark attendance for a student (Admin/Teacher only)
router.post('/', requireTeacher, validate(createAttendanceSchema), attendanceController.createAttendance);

// POST /attendance/bulk - Mark bulk attendance for a class (Admin/Teacher only)
router.post('/bulk', requireTeacher, validate(markBulkAttendanceSchema), attendanceController.markBulkAttendance);

// PATCH /attendance/:id - Update attendance record (Admin/Teacher only)
router.patch('/:id', requireTeacher, validate(updateAttendanceSchema), attendanceController.updateAttendance);

// DELETE /attendance/:id - Delete attendance record (Admin only)
router.delete('/:id', requireAdmin, validate(deleteAttendanceSchema), attendanceController.deleteAttendance);

export default router;