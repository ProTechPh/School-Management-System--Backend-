import { z } from 'zod';

export const createExamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Exam name is required').max(100, 'Exam name cannot exceed 100 characters'),
    class: z.string().min(1, 'Class ID is required'),
    subject: z.string().min(1, 'Subject ID is required'),
    date: z.string().datetime('Invalid date format'),
    maxMarks: z.number().min(1, 'Maximum marks must be at least 1').max(1000, 'Maximum marks cannot exceed 1000'),
    duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
    examType: z.enum(['QUIZ', 'MIDTERM', 'FINAL', 'ASSIGNMENT', 'PROJECT'], {
      errorMap: () => ({ message: 'Exam type must be one of: QUIZ, MIDTERM, FINAL, ASSIGNMENT, PROJECT' }),
    }),
    instructions: z.string().max(1000, 'Instructions cannot exceed 1000 characters').optional(),
    status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});

export const updateExamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Exam ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Exam name is required').max(100, 'Exam name cannot exceed 100 characters').optional(),
    date: z.string().datetime('Invalid date format').optional(),
    maxMarks: z.number().min(1, 'Maximum marks must be at least 1').max(1000, 'Maximum marks cannot exceed 1000').optional(),
    duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours').optional(),
    examType: z.enum(['QUIZ', 'MIDTERM', 'FINAL', 'ASSIGNMENT', 'PROJECT']).optional(),
    instructions: z.string().max(1000, 'Instructions cannot exceed 1000 characters').optional(),
    status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});

export const getExamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Exam ID is required'),
  }),
});

export const getExamsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    class: z.string().optional(),
    subject: z.string().optional(),
    examType: z.enum(['QUIZ', 'MIDTERM', 'FINAL', 'ASSIGNMENT', 'PROJECT']).optional(),
    status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const deleteExamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Exam ID is required'),
  }),
});

export const createGradeSchema = z.object({
  body: z.object({
    exam: z.string().min(1, 'Exam ID is required'),
    student: z.string().min(1, 'Student ID is required'),
    marks: z.number().min(0, 'Marks cannot be negative'),
    remarks: z.string().max(200, 'Remarks cannot exceed 200 characters').optional(),
  }),
});

export const updateGradeSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Grade ID is required'),
  }),
  body: z.object({
    marks: z.number().min(0, 'Marks cannot be negative').optional(),
    remarks: z.string().max(200, 'Remarks cannot exceed 200 characters').optional(),
  }),
});

export const getGradeSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Grade ID is required'),
  }),
});

export const getGradesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    exam: z.string().optional(),
    student: z.string().optional(),
    class: z.string().optional(),
    subject: z.string().optional(),
    grade: z.string().optional(),
  }),
});

export const deleteGradeSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Grade ID is required'),
  }),
});

export const getExamGradesSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Exam ID is required'),
  }),
});

export const getStudentGradesSchema = z.object({
  query: z.object({
    student: z.string().min(1, 'Student ID is required'),
    class: z.string().optional(),
    subject: z.string().optional(),
    examType: z.enum(['QUIZ', 'MIDTERM', 'FINAL', 'ASSIGNMENT', 'PROJECT']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});