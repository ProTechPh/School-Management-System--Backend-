import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './announcement.service';
import { AuthRequest } from '../../middleware/auth';

export class AnnouncementController {
  private announcementService: AnnouncementService;

  constructor() {
    this.announcementService = new AnnouncementService();
  }

  /**
   * @swagger
   * /announcements:
   *   get:
   *     summary: Get all announcements
   *     tags: [Announcements]
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
   *         description: Number of announcements per page
   *       - in: query
   *         name: audience
   *         schema:
   *           type: string
   *           enum: [ALL, CLASS, ROLE, USER]
   *         description: Filter by audience
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH, URGENT]
   *         description: Filter by priority
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [DRAFT, PUBLISHED, ARCHIVED]
   *         description: Filter by status (Admin only)
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search in title and body
   *     responses:
   *       200:
   *         description: List of announcements
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
   *                     announcements:
   *                       type: array
   *                       items:
   *                         type: object
   *                     pagination:
   *                       type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getAnnouncements = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.announcementService.getAnnouncements(
        req.query,
        req.user?.role,
        req.user?.userId
      );
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
   * /announcements/{id}:
   *   get:
   *     summary: Get announcement by ID
   *     tags: [Announcements]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Announcement ID
   *     responses:
   *       200:
   *         description: Announcement details
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
  getAnnouncementById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcement = await this.announcementService.getAnnouncementById(
        req.params.id,
        req.user?.role,
        req.user?.userId
      );
      res.status(200).json({
        success: true,
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /announcements:
   *   post:
   *     summary: Create a new announcement
   *     tags: [Announcements]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - body
   *               - audience
   *             properties:
   *               title:
   *                 type: string
   *               body:
   *                 type: string
   *               audience:
   *                 type: string
   *                 enum: [ALL, CLASS, ROLE, USER]
   *               targets:
   *                 type: array
   *                 items:
   *                   type: string
   *               priority:
   *                 type: string
   *                 enum: [LOW, MEDIUM, HIGH, URGENT]
   *               status:
   *                 type: string
   *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
   *               expiresAt:
   *                 type: string
   *                 format: date-time
   *               attachments:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: Announcement created successfully
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
  createAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcementData = {
        ...req.body,
        createdBy: req.user!.userId,
      };
      const announcement = await this.announcementService.createAnnouncement(announcementData);
      res.status(201).json({
        success: true,
        data: announcement,
        message: 'Announcement created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /announcements/{id}:
   *   patch:
   *     summary: Update announcement
   *     tags: [Announcements]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Announcement ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               body:
   *                 type: string
   *               audience:
   *                 type: string
   *                 enum: [ALL, CLASS, ROLE, USER]
   *               targets:
   *                 type: array
   *                 items:
   *                   type: string
   *               priority:
   *                 type: string
   *                 enum: [LOW, MEDIUM, HIGH, URGENT]
   *               status:
   *                 type: string
   *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
   *               expiresAt:
   *                 type: string
   *                 format: date-time
   *               attachments:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Announcement updated successfully
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
  updateAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcement = await this.announcementService.updateAnnouncement(
        req.params.id,
        req.body,
        req.user?.role,
        req.user?.userId
      );
      res.status(200).json({
        success: true,
        data: announcement,
        message: 'Announcement updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /announcements/{id}:
   *   delete:
   *     summary: Delete announcement
   *     tags: [Announcements]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Announcement ID
   *     responses:
   *       200:
   *         description: Announcement deleted successfully
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
  deleteAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.announcementService.deleteAnnouncement(
        req.params.id,
        req.user?.role,
        req.user?.userId
      );
      res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /announcements/{id}/publish:
   *   post:
   *     summary: Publish announcement
   *     tags: [Announcements]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Announcement ID
   *     responses:
   *       200:
   *         description: Announcement published successfully
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
  publishAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcement = await this.announcementService.publishAnnouncement(
        req.params.id,
        req.user?.role,
        req.user?.userId
      );
      res.status(200).json({
        success: true,
        data: announcement,
        message: 'Announcement published successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /announcements/{id}/archive:
   *   post:
   *     summary: Archive announcement
   *     tags: [Announcements]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Announcement ID
   *     responses:
   *       200:
   *         description: Announcement archived successfully
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
  archiveAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcement = await this.announcementService.archiveAnnouncement(
        req.params.id,
        req.user?.role,
        req.user?.userId
      );
      res.status(200).json({
        success: true,
        data: announcement,
        message: 'Announcement archived successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /announcements/my:
   *   get:
   *     summary: Get my announcements
   *     tags: [Announcements]
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
   *         description: Number of announcements per page
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [DRAFT, PUBLISHED, ARCHIVED]
   *         description: Filter by status
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH, URGENT]
   *         description: Filter by priority
   *     responses:
   *       200:
   *         description: My announcements
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
   *                     announcements:
   *                       type: array
   *                       items:
   *                         type: object
   *                     pagination:
   *                       type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  getMyAnnouncements = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.announcementService.getMyAnnouncements(req.user!.userId, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
