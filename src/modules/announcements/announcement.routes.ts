import { Router } from 'express';
import { AnnouncementController } from './announcement.controller';
import { authenticate } from '../../middleware/auth';
import { requireAdmin, requireTeacher } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  getAnnouncementSchema,
  getAnnouncementsSchema,
  deleteAnnouncementSchema,
  publishAnnouncementSchema,
  archiveAnnouncementSchema,
  getMyAnnouncementsSchema,
} from './announcement.schemas';

const router = Router();
const announcementController = new AnnouncementController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Announcements
 *   description: Announcement management endpoints
 */

// GET /announcements - Get all announcements
router.get('/', validate(getAnnouncementsSchema), announcementController.getAnnouncements);

// GET /announcements/my - Get my announcements
router.get('/my', validate(getMyAnnouncementsSchema), announcementController.getMyAnnouncements);

// GET /announcements/:id - Get announcement by ID
router.get('/:id', validate(getAnnouncementSchema), announcementController.getAnnouncementById);

// POST /announcements - Create new announcement (Admin/Teacher only)
router.post('/', requireTeacher, validate(createAnnouncementSchema), announcementController.createAnnouncement);

// PATCH /announcements/:id - Update announcement (Admin/Teacher only)
router.patch('/:id', requireTeacher, validate(updateAnnouncementSchema), announcementController.updateAnnouncement);

// DELETE /announcements/:id - Delete announcement (Admin/Teacher only)
router.delete('/:id', requireTeacher, validate(deleteAnnouncementSchema), announcementController.deleteAnnouncement);

// POST /announcements/:id/publish - Publish announcement (Admin/Teacher only)
router.post('/:id/publish', requireTeacher, validate(publishAnnouncementSchema), announcementController.publishAnnouncement);

// POST /announcements/:id/archive - Archive announcement (Admin/Teacher only)
router.post('/:id/archive', requireTeacher, validate(archiveAnnouncementSchema), announcementController.archiveAnnouncement);

export default router;
