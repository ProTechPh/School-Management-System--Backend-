import { Request, Response, NextFunction } from 'express';
import { EnrollmentService } from './enrollment.service';

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor() {
    this.enrollmentService = new EnrollmentService();
  }

  /**
   * @swagger
   * /enrollments:
   *   get:
   *     summary: Get all enrollments
   *     tags: [Enrollments]
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
   *         description: Number of enrollments per page
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
   *         name: status
   *         schema:
   *           type: string
   *           enum: [ACTIVE, INACTIVE, SUSPENDED, COMPLETED]
   *         description: Filter by status
   *       - in: query
   *         name: academicYear
   *         schema:
   *           type: integer
   *         description: Filter by academic year
   *     responses:
   *       200:
   *         description: List of enrollments
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
   *                     enrollments:
   *                       type: array
   *                       items:
   *                         type: object
   *                     pagination:
   *                       type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.enrollmentService.getEnrollments(req.query);
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
   * /enrollments/{id}:
   *   get:
   *     summary: Get enrollment by ID
   *     tags: [Enrollments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Enrollment ID
   *     responses:
   *       200:
   *         description: Enrollment details
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
  getEnrollmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const enrollment = await this.enrollmentService.getEnrollmentById(req.params.id);
      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /enrollments:
   *   post:
   *     summary: Create a new enrollment
   *     tags: [Enrollments]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - student
   *               - class
   *               - academicYear
   *             properties:
   *               student:
   *                 type: string
   *               class:
   *                 type: string
   *               subjects:
   *                 type: array
   *                 items:
   *                   type: string
   *               academicYear:
   *                 type: integer
   *               status:
   *                 type: string
   *                 enum: [ACTIVE, INACTIVE, SUSPENDED, COMPLETED]
   *     responses:
   *       201:
   *         description: Enrollment created successfully
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
  createEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const enrollment = await this.enrollmentService.createEnrollment(req.body);
      res.status(201).json({
        success: true,
        data: enrollment,
        message: 'Enrollment created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /enrollments/{id}:
   *   patch:
   *     summary: Update enrollment
   *     tags: [Enrollments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Enrollment ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               subjects:
   *                 type: array
   *                 items:
   *                   type: string
   *               status:
   *                 type: string
   *                 enum: [ACTIVE, INACTIVE, SUSPENDED, COMPLETED]
   *     responses:
   *       200:
   *         description: Enrollment updated successfully
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
  updateEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const enrollment = await this.enrollmentService.updateEnrollment(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: enrollment,
        message: 'Enrollment updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /enrollments/{id}:
   *   delete:
   *     summary: Delete enrollment
   *     tags: [Enrollments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Enrollment ID
   *     responses:
   *       200:
   *         description: Enrollment deleted successfully
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
  deleteEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.enrollmentService.deleteEnrollment(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Enrollment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /enrollments/{id}/subjects:
   *   post:
   *     summary: Add subject to enrollment
   *     tags: [Enrollments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Enrollment ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - subjectId
   *             properties:
   *               subjectId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Subject added to enrollment successfully
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
  addSubjectToEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const enrollment = await this.enrollmentService.addSubjectToEnrollment(req.params.id, req.body.subjectId);
      res.status(200).json({
        success: true,
        data: enrollment,
        message: 'Subject added to enrollment successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /enrollments/{id}/subjects/{subjectId}:
   *   delete:
   *     summary: Remove subject from enrollment
   *     tags: [Enrollments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Enrollment ID
   *       - in: path
   *         name: subjectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Subject ID
   *     responses:
   *       200:
   *         description: Subject removed from enrollment successfully
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
  removeSubjectFromEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const enrollment = await this.enrollmentService.removeSubjectFromEnrollment(req.params.id, req.params.subjectId);
      res.status(200).json({
        success: true,
        data: enrollment,
        message: 'Subject removed from enrollment successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}