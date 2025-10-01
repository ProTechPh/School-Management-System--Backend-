import { z } from 'zod';

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Class name is required').max(50, 'Class name cannot exceed 50 characters'),
    section: z.string().min(1, 'Section is required').max(10, 'Section cannot exceed 10 characters'),
    year: z.number().min(2020, 'Year must be 2020 or later').max(2030, 'Year must be 2030 or earlier'),
    classTeacher: z.string().min(1, 'Class teacher ID is required'),
    capacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity cannot exceed 100').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const updateClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Class ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Class name is required').max(50, 'Class name cannot exceed 50 characters').optional(),
    section: z.string().min(1, 'Section is required').max(10, 'Section cannot exceed 10 characters').optional(),
    year: z.number().min(2020, 'Year must be 2020 or later').max(2030, 'Year must be 2030 or earlier').optional(),
    classTeacher: z.string().min(1, 'Class teacher ID is required').optional(),
    capacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity cannot exceed 100').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const getClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Class ID is required'),
  }),
});

export const getClassesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    year: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    search: z.string().optional(),
  }),
});

export const deleteClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Class ID is required'),
  }),
});

export const addStudentToClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Class ID is required'),
  }),
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
  }),
});

export const removeStudentFromClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Class ID is required'),
    studentId: z.string().min(1, 'Student ID is required'),
  }),
});

