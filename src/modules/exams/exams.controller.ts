import { Request, Response, NextFunction } from 'express';
import { ExamsService } from './exams.service';
import { AuthRequest } from '../../middleware/auth';

export class ExamsController {
  private examsService: ExamsService;

  constructor() {
    this.examsService = new ExamsService();
  }

  // Exam endpoints
  /**
   * @swagger
   * /exams:
   *   get:
   *     summary: Get all exams
   *     tags: [Exams]
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
   *         description: Number of exams per page
   *       - in: query
   *         name: class
   *         schema:
   *           type: string
   *         description: Filter by class ID
   *       - in: query
   *         name: subject
   *         schema:
   *           type: string
   *         description: Filter by subject ID
   *       - in: query
   *         name: examType
   *         schema:
   *           type: string
   *           enum: [QUIZ, MIDTERM, FINAL, ASSIGNMENT, PROJECT]
   *         description: Filter by exam type
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [SCHEDULED, ONGOING, COMPLETED, CANCELLED]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: List of exams
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
   *                     exams:
   *                       type: array
   *                       items:
   *                         type: object
   *                     pagination:
   *                       type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getExams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.examsService.getExams(req.query);
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
   * /exams/{id}:
   *   get:
   *     summary: Get exam by ID
   *     tags: [Exams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Exam ID
   *     responses:
   *       200:
   *         description: Exam details
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
  getExamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await this.examsService.getExamById(req.params.id);
      res.status(200).json({
        success: true,
        data: exam,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /exams:
   *   post:
   *     summary: Create a new exam
   *     tags: [Exams]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - class
   *               - subject
   *               - date
   *               - maxMarks
   *               - duration
   *               - examType
   *             properties:
   *               name:
   *                 type: string
   *               class:
   *                 type: string
   *               subject:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date-time
   *               maxMarks:
   *                 type: integer
   *               duration:
   *                 type: integer
   *               examType:
   *                 type: string
   *                 enum: [QUIZ, MIDTERM, FINAL, ASSIGNMENT, PROJECT]
   *               instructions:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [SCHEDULED, ONGOING, COMPLETED, CANCELLED]
   *     responses:
   *       201:
   *         description: Exam created successfully
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
  createExam = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const examData = {
        ...req.body,
        createdBy: req.user!.userId,
      };
      const exam = await this.examsService.createExam(examData);
      res.status(201).json({
        success: true,
        data: exam,
        message: 'Exam created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /exams/{id}:
   *   patch:
   *     summary: Update exam
   *     tags: [Exams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Exam ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date-time
   *               maxMarks:
   *                 type: integer
   *               duration:
   *                 type: integer
   *               examType:
   *                 type: string
   *                 enum: [QUIZ, MIDTERM, FINAL, ASSIGNMENT, PROJECT]
   *               instructions:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [SCHEDULED, ONGOING, COMPLETED, CANCELLED]
   *     responses:
   *       200:
   *         description: Exam updated successfully
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
  updateExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await this.examsService.updateExam(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: exam,
        message: 'Exam updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /exams/{id}:
   *   delete:
   *     summary: Delete exam
   *     tags: [Exams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Exam ID
   *     responses:
   *       200:
   *         description: Exam deleted successfully
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
  deleteExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.examsService.deleteExam(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Exam deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Grade endpoints
  /**
   * @swagger
   * /grades:
   *   get:
   *     summary: Get all grades
   *     tags: [Grades]
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
   *         description: Number of grades per page
   *       - in: query
   *         name: exam
   *         schema:
   *           type: string
   *         description: Filter by exam ID
   *       - in: query
   *         name: student
   *         schema:
   *           type: string
   *         description: Filter by student ID
   *       - in: query
   *         name: grade
   *         schema:
   *           type: string
   *         description: Filter by grade
   *     responses:
   *       200:
   *         description: List of grades
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
   *                     grades:
   *                       type: array
   *                       items:
   *                         type: object
   *                     pagination:
   *                       type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getGrades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.examsService.getGrades(req.query);
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
   * /grades:
   *   post:
   *     summary: Create a new grade
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - exam
   *               - student
   *               - marks
   *             properties:
   *               exam:
   *                 type: string
   *               student:
   *                 type: string
   *               marks:
   *                 type: number
   *               remarks:
   *                 type: string
   *     responses:
   *       201:
   *         description: Grade created successfully
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
  createGrade = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gradeData = {
        ...req.body,
        gradedBy: req.user!.userId,
      };
      const grade = await this.examsService.createGrade(gradeData);
      res.status(201).json({
        success: true,
        data: grade,
        message: 'Grade created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /exams/{id}/grades:
   *   get:
   *     summary: Get grades for a specific exam
   *     tags: [Exams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Exam ID
   *     responses:
   *       200:
   *         description: Exam grades
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getExamGrades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const grades = await this.examsService.getExamGrades(req.params.id);
      res.status(200).json({
        success: true,
        data: grades,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /grades/student:
   *   get:
   *     summary: Get grades for a specific student
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: student
   *         required: true
   *         schema:
   *           type: string
   *         description: Student ID
   *       - in: query
   *         name: class
   *         schema:
   *           type: string
   *         description: Filter by class ID
   *       - in: query
   *         name: subject
   *         schema:
   *           type: string
   *         description: Filter by subject ID
   *       - in: query
   *         name: examType
   *         schema:
   *           type: string
   *           enum: [QUIZ, MIDTERM, FINAL, ASSIGNMENT, PROJECT]
   *         description: Filter by exam type
   *     responses:
   *       200:
   *         description: Student grades
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  getStudentGrades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const grades = await this.examsService.getStudentGrades(req.query);
      res.status(200).json({
        success: true,
        data: grades,
      });
    } catch (error) {
      next(error);
    }
  };
}