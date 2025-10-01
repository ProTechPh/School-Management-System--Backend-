import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from './attendance.service';
import { AuthRequest } from '../../middleware/auth';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  /**
   * @swagger
   * /attendance:
   *   get:
   *     summary: Get all attendance records
   *     tags: [Attendance]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of records per page
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by specific date
   *       - in: query
   *         name: class
   *         schema:
   *           type: string
   *         description: Filter by class ID
   *       - in: query
   *         name: student
   *         schema:
   *           type: string
   *         description: Filter by student ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PRESENT, ABSENT, LATE, EXCUSED]
   *         description: Filter by attendance status
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter from start date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter to end date
   *     responses:
   *       200:
   *         description: List of attendance records
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     attendances:
   *                       type: array
   *                       items:
   *                         type: object
   *                     pagination:
   *                       type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getAttendances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.attendanceService.getAttendances(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /attendance/{id}:
   *   get:
   *     summary: Get attendance record by ID
   *     tags: [Attendance]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Attendance record ID
   *     responses:
   *       200:
   *         description: Attendance record details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getAttendanceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const attendance = await this.attendanceService.getAttendanceById(req.params.id);
      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /attendance:
   *   post:
   *     summary: Mark attendance for a student
   *     tags: [Attendance]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - date
   *               - class
   *               - student
   *               - status
   *             properties:
   *               date:
   *                 type: string
   *                 format: date-time
   *               class:
   *                 type: string
   *               student:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [PRESENT, ABSENT, LATE, EXCUSED]
   *               remarks:
   *                 type: string
   *                 maxLength: 200
   *     responses:
   *       201:
   *         description: Attendance marked successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  createAttendance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const attendanceData = {
        ...req.body,
        markedBy: req.user!.userId,
      };
      const attendance = await this.attendanceService.createAttendance(attendanceData);
      res.status(201).json({
        success: true,
        data: attendance,
        message: 'Attendance marked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /attendance/{id}:
   *   patch:
   *     summary: Update attendance record
   *     tags: [Attendance]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Attendance record ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [PRESENT, ABSENT, LATE, EXCUSED]
   *               remarks:
   *                 type: string
   *                 maxLength: 200
   *     responses:
   *       200:
   *         description: Attendance updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  updateAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const attendance = await this.attendanceService.updateAttendance(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: attendance,
        message: 'Attendance updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /attendance/{id}:
   *   delete:
   *     summary: Delete attendance record
   *     tags: [Attendance]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Attendance record ID
   *     responses:
   *       200:
   *         description: Attendance deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  deleteAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.attendanceService.deleteAttendance(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Attendance deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /attendance/bulk:
   *   post:
   *     summary: Mark bulk attendance for a class
   *     tags: [Attendance]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - date
   *               - class
   *               - attendanceRecords
   *             properties:
   *               date:
   *                 type: string
   *                 format: date-time
   *               class:
   *                 type: string
   *               attendanceRecords:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - student
   *                     - status
   *                   properties:
   *                     student:
   *                       type: string
   *                     status:
   *                       type: string
   *                       enum: [PRESENT, ABSENT, LATE, EXCUSED]
   *                     remarks:
   *                       type: string
   *                       maxLength: 200
   *     responses:
   *       201:
   *         description: Bulk attendance marked successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                 message:
   *                   type: string
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  markBulkAttendance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bulkData = {
        ...req.body,
        markedBy: req.user!.userId,
      };
      const attendances = await this.attendanceService.markBulkAttendance(bulkData);
      res.status(201).json({
        success: true,
        data: attendances,
        message: 'Bulk attendance marked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /attendance/report:
   *   get:
   *     summary: Get attendance report
   *     tags: [Attendance]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: student
   *         schema:
   *           type: string
   *         description: Filter by student ID
   *       - in: query
   *         name: class
   *         schema:
   *           type: string
   *         description: Filter by class ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter from start date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter to end date
   *       - in: query
   *         name: academicYear
   *         schema:
   *           type: string
   *         description: Filter by academic year
   *     responses:
   *       200:
   *         description: Attendance report
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     summary:
   *                       type: object
   *                     records:
   *                       type: array
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getAttendanceReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.attendanceService.getAttendanceReport(req.query);
      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };
}