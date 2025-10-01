import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
    body: z.string().min(1, 'Body is required').max(2000, 'Body cannot exceed 2000 characters'),
    audience: z.enum(['ALL', 'CLASS', 'ROLE', 'USER'], {
      errorMap: () => ({ message: 'Audience must be one of: ALL, CLASS, ROLE, USER' }),
    }),
    targets: z.array(z.string()).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    expiresAt: z.string().datetime('Invalid date format').optional(),
    attachments: z.array(z.string()).optional(),
  }),
});

export const updateAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Announcement ID is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
    body: z.string().min(1, 'Body is required').max(2000, 'Body cannot exceed 2000 characters').optional(),
    audience: z.enum(['ALL', 'CLASS', 'ROLE', 'USER']).optional(),
    targets: z.array(z.string()).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    expiresAt: z.string().datetime('Invalid date format').optional(),
    attachments: z.array(z.string()).optional(),
  }),
});

export const getAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Announcement ID is required'),
  }),
});

export const getAnnouncementsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    audience: z.enum(['ALL', 'CLASS', 'ROLE', 'USER']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    createdBy: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const deleteAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Announcement ID is required'),
  }),
});

export const publishAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Announcement ID is required'),
  }),
});

export const archiveAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Announcement ID is required'),
  }),
});

export const getMyAnnouncementsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  }),
});