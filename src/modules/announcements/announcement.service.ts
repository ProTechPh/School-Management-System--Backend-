import { Announcement, IAnnouncement } from './announcement.model';
import { User } from '../users/user.model';
import { Class } from '../classes/class.model';
import { getPaginationOptions, getPaginationResult } from '../../utils/pagination';
import { CustomError } from '../../middleware/errorHandler';

export class AnnouncementService {
  async createAnnouncement(announcementData: {
    title: string;
    body: string;
    audience: string;
    targets?: string[];
    createdBy: string;
    priority?: string;
    status?: string;
    expiresAt?: string;
    attachments?: string[];
  }): Promise<IAnnouncement> {
    const { title, body, audience, targets, createdBy, priority, status, expiresAt, attachments } = announcementData;

    // Verify createdBy user exists
    const createdByUser = await User.findById(createdBy);
    if (!createdByUser) {
      throw new CustomError('User not found', 404);
    }

    // Validate targets based on audience
    if (audience !== 'ALL' && (!targets || targets.length === 0)) {
      throw new CustomError('Targets are required when audience is not ALL', 400);
    }

    // Verify targets exist if provided
    if (targets && targets.length > 0) {
      if (audience === 'CLASS') {
        const classes = await Class.find({ _id: { $in: targets } });
        if (classes.length !== targets.length) {
          throw new CustomError('One or more classes not found', 400);
        }
      } else if (audience === 'USER' || audience === 'ROLE') {
        const users = await User.find({ _id: { $in: targets } });
        if (users.length !== targets.length) {
          throw new CustomError('One or more users not found', 400);
        }
      }
    }

    // Create announcement
    const newAnnouncement = new Announcement({
      title,
      body,
      audience,
      targets: targets || [],
      createdBy,
      priority: priority || 'MEDIUM',
      status: status || 'DRAFT',
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      attachments: attachments || [],
    });

    return await newAnnouncement.save();
  }

  async getAnnouncements(query: any, userRole?: string, userId?: string): Promise<{ announcements: IAnnouncement[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    
    // Only show published announcements to non-admin users
    if (userRole !== 'ADMIN') {
      filter.status = 'PUBLISHED';
      filter.$or = [
        { audience: 'ALL' },
        { audience: 'ROLE', targets: userId },
        { audience: 'USER', targets: userId },
      ];
    } else {
      // Admin can see all announcements
      if (query.status) filter.status = query.status;
      if (query.createdBy) filter.createdBy = query.createdBy;
    }

    if (query.audience) filter.audience = query.audience;
    if (query.priority) filter.priority = query.priority;
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { body: { $regex: query.search, $options: 'i' } },
      ];
    }
    
    if (query.startDate || query.endDate) {
      filter.publishedAt = {};
      if (query.startDate) filter.publishedAt.$gte = new Date(query.startDate);
      if (query.endDate) filter.publishedAt.$lte = new Date(query.endDate);
    }

    // Filter out expired announcements
    filter.$and = [
      {
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } },
        ],
      },
    ];

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy', 'firstName lastName email')
        .populate('targets', 'firstName lastName email name section')
        .lean(),
      Announcement.countDocuments(filter),
    ]);

    return getPaginationResult(announcements, total, options) as { announcements: IAnnouncement[]; pagination: any };
  }

  async getAnnouncementById(id: string, userRole?: string, userId?: string): Promise<IAnnouncement> {
    const filter: any = { _id: id };
    
    // Non-admin users can only see published announcements
    if (userRole !== 'ADMIN') {
      filter.status = 'PUBLISHED';
      filter.$or = [
        { audience: 'ALL' },
        { audience: 'ROLE', targets: userId },
        { audience: 'USER', targets: userId },
      ];
      
      // Filter out expired announcements
      filter.$and = [
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
          ],
        },
      ];
    }

    const announcement = await Announcement.findOne(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('targets', 'firstName lastName email name section');

    if (!announcement) {
      throw new CustomError('Announcement not found', 404);
    }

    return announcement;
  }

  async updateAnnouncement(id: string, updateData: Partial<IAnnouncement>, userRole?: string, userId?: string): Promise<IAnnouncement> {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      throw new CustomError('Announcement not found', 404);
    }

    // Only admin or the creator can update
    if (userRole !== 'ADMIN' && announcement.createdBy.toString() !== userId) {
      throw new CustomError('You can only update your own announcements', 403);
    }

    // Validate targets if being updated
    if (updateData.targets && updateData.targets.length > 0) {
      const audience = updateData.audience || announcement.audience;
      if (audience === 'CLASS') {
        const classes = await Class.find({ _id: { $in: updateData.targets } });
        if (classes.length !== updateData.targets.length) {
          throw new CustomError('One or more classes not found', 400);
        }
      } else if (audience === 'USER' || audience === 'ROLE') {
        const users = await User.find({ _id: { $in: updateData.targets } });
        if (users.length !== updateData.targets.length) {
          throw new CustomError('One or more users not found', 400);
        }
      }
    }

    Object.assign(announcement, updateData);
    return await announcement.save();
  }

  async deleteAnnouncement(id: string, userRole?: string, userId?: string): Promise<void> {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      throw new CustomError('Announcement not found', 404);
    }

    // Only admin or the creator can delete
    if (userRole !== 'ADMIN' && announcement.createdBy.toString() !== userId) {
      throw new CustomError('You can only delete your own announcements', 403);
    }

    await Announcement.findByIdAndDelete(id);
  }

  async publishAnnouncement(id: string, userRole?: string, userId?: string): Promise<IAnnouncement> {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      throw new CustomError('Announcement not found', 404);
    }

    // Only admin or the creator can publish
    if (userRole !== 'ADMIN' && announcement.createdBy.toString() !== userId) {
      throw new CustomError('You can only publish your own announcements', 403);
    }

    announcement.status = 'PUBLISHED';
    announcement.publishedAt = new Date();
    return await announcement.save();
  }

  async archiveAnnouncement(id: string, userRole?: string, userId?: string): Promise<IAnnouncement> {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      throw new CustomError('Announcement not found', 404);
    }

    // Only admin or the creator can archive
    if (userRole !== 'ADMIN' && announcement.createdBy.toString() !== userId) {
      throw new CustomError('You can only archive your own announcements', 403);
    }

    announcement.status = 'ARCHIVED';
    return await announcement.save();
  }

  async getMyAnnouncements(userId: string, query: any): Promise<{ announcements: IAnnouncement[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = { createdBy: userId };
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('targets', 'firstName lastName email name section')
        .lean(),
      Announcement.countDocuments(filter),
    ]);

    return getPaginationResult(announcements, total, options) as { announcements: IAnnouncement[]; pagination: any };
  }

  async getAnnouncementsForUser(userId: string, userRole: string): Promise<IAnnouncement[]> {
    const filter: any = {
      status: 'PUBLISHED',
      $or: [
        { audience: 'ALL' },
        { audience: 'ROLE', targets: userId },
        { audience: 'USER', targets: userId },
      ],
      $and: [
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
          ],
        },
      ],
    };

    return await Announcement.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('targets', 'firstName lastName email name section')
      .sort({ priority: -1, publishedAt: -1 })
      .limit(10);
  }
}
