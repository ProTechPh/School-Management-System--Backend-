import { z } from 'zod';

export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Subject name is required').max(100, 'Subject name cannot exceed 100 characters'),
    code: z.string().min(1, 'Subject code is required').max(10, 'Subject code cannot exceed 10 characters'),
    class: z.string().min(1, 'Class ID is required'),
    teacher: z.string().min(1, 'Teacher ID is required'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const updateSubjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subject ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Subject name is required').max(100, 'Subject name cannot exceed 100 characters').optional(),
    code: z.string().min(1, 'Subject code is required').max(10, 'Subject code cannot exceed 10 characters').optional(),
    class: z.string().min(1, 'Class ID is required').optional(),
    teacher: z.string().min(1, 'Teacher ID is required').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const getSubjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subject ID is required'),
  }),
});

export const getSubjectsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    class: z.string().optional(),
    teacher: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    search: z.string().optional(),
  }),
});

export const deleteSubjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subject ID is required'),
  }),
});

