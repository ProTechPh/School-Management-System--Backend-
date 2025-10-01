import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters'),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], {
      errorMap: () => ({ message: 'Role must be one of: ADMIN, TEACHER, STUDENT, PARENT' }),
    }),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters').optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    search: z.string().optional(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

