import { Request, Response, NextFunction } from 'express';
import { ClassService } from './class.service';

export class ClassController {
  private classService: ClassService;

  constructor() {
    this.classService = new ClassService();
  }

  /**
   * @swagger
   * /classes:
   *   get:
   *     summary: Get all classes
   *     tags: [Classes]
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
   *         description: Number of classes per page
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Filter by academic year
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [ACTIVE, INACTIVE]
   *         description: Filter by status
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search in class name and section
   *     responses:
   *       200:
   *         description: List of classes
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
   *                     classes:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           _id:
   *                             type: string
   *                           name:
   *                             type: string
   *                           section:
   *                             type: string
   *                           year:
   *                             type: integer
   *                           classTeacher:
   *                             type: object
   *                           students:
   *                             type: array
   *                           subjects:
   *                             type: array
   *                           capacity:
   *                             type: integer
   *                           status:
   *                             type: string
   *                     pagination:
   *                       type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getClasses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.classService.getClasses(req.query);
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
   * /classes/{id}:
   *   get:
   *     summary: Get class by ID
   *     tags: [Classes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Class ID
   *     responses:
   *       200:
   *         description: Class details
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
  getClassById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const classData = await this.classService.getClassById(req.params.id);
      res.status(200).json({
        success: true,
        data: classData,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /classes:
   *   post:
   *     summary: Create a new class
   *     tags: [Classes]
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
   *               - section
   *               - year
   *               - classTeacher
   *             properties:
   *               name:
   *                 type: string
   *               section:
   *                 type: string
   *               year:
   *                 type: integer
   *               classTeacher:
   *                 type: string
   *               capacity:
   *                 type: integer
   *               status:
   *                 type: string
   *                 enum: [ACTIVE, INACTIVE]
   *     responses:
   *       201:
   *         description: Class created successfully
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
  createClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const classData = await this.classService.createClass(req.body);
      res.status(201).json({
        success: true,
        data: classData,
        message: 'Class created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /classes/{id}:
   *   patch:
   *     summary: Update class
   *     tags: [Classes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Class ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               section:
   *                 type: string
   *               year:
   *                 type: integer
   *               classTeacher:
   *                 type: string
   *               capacity:
   *                 type: integer
   *               status:
   *                 type: string
   *                 enum: [ACTIVE, INACTIVE]
   *     responses:
   *       200:
   *         description: Class updated successfully
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
  updateClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const classData = await this.classService.updateClass(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: classData,
        message: 'Class updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /classes/{id}:
   *   delete:
   *     summary: Delete class
   *     tags: [Classes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Class ID
   *     responses:
   *       200:
   *         description: Class deleted successfully
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
  deleteClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.classService.deleteClass(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Class deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /classes/{id}/students:
   *   post:
   *     summary: Add student to class
   *     tags: [Classes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Class ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - studentId
   *             properties:
   *               studentId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Student added to class successfully
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
  addStudentToClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const classData = await this.classService.addStudentToClass(req.params.id, req.body.studentId);
      res.status(200).json({
        success: true,
        data: classData,
        message: 'Student added to class successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /classes/{id}/students/{studentId}:
   *   delete:
   *     summary: Remove student from class
   *     tags: [Classes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Class ID
   *       - in: path
   *         name: studentId
   *         required: true
   *         schema:
   *           type: string
   *         description: Student ID
   *     responses:
   *       200:
   *         description: Student removed from class successfully
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
  removeStudentFromClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const classData = await this.classService.removeStudentFromClass(req.params.id, req.params.studentId);
      res.status(200).json({
        success: true,
        data: classData,
        message: 'Student removed from class successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

