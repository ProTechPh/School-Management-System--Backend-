import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  body: z.object({
    student: z.string().min(1, 'Student ID is required'),
    class: z.string().min(1, 'Class ID is required'),
    subjects: z.array(z.string()).optional(),
    academicYear: z.number().min(2020, 'Academic year must be 2020 or later').max(2030, 'Academic year must be 2030 or earlier'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'COMPLETED']).optional(),
  }),
});

export const updateEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Enrollment ID is required'),
  }),
  body: z.object({
    subjects: z.array(z.string()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'COMPLETED']).optional(),
  }),
});

export const getEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Enrollment ID is required'),
  }),
});

export const getEnrollmentsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    student: z.string().optional(),
    class: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'COMPLETED']).optional(),
    academicYear: z.string().optional(),
  }),
});

export const deleteEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Enrollment ID is required'),
  }),
});

export const addSubjectToEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Enrollment ID is required'),
  }),
  body: z.object({
    subjectId: z.string().min(1, 'Subject ID is required'),
  }),
});

export const removeSubjectFromEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Enrollment ID is required'),
    subjectId: z.string().min(1, 'Subject ID is required'),
  }),
});