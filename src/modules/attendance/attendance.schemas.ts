import { z } from 'zod';

export const createAttendanceSchema = z.object({
  body: z.object({
    date: z.string().datetime('Invalid date format'),
    class: z.string().min(1, 'Class ID is required'),
    student: z.string().min(1, 'Student ID is required'),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], {
      errorMap: () => ({ message: 'Status must be one of: PRESENT, ABSENT, LATE, EXCUSED' }),
    }),
    remarks: z.string().max(200, 'Remarks cannot exceed 200 characters').optional(),
  }),
});

export const updateAttendanceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Attendance ID is required'),
  }),
  body: z.object({
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).optional(),
    remarks: z.string().max(200, 'Remarks cannot exceed 200 characters').optional(),
  }),
});

export const getAttendanceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Attendance ID is required'),
  }),
});

export const getAttendancesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    date: z.string().optional(),
    class: z.string().optional(),
    student: z.string().optional(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).optional(),
    markedBy: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const deleteAttendanceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Attendance ID is required'),
  }),
});

export const markBulkAttendanceSchema = z.object({
  body: z.object({
    date: z.string().datetime('Invalid date format'),
    class: z.string().min(1, 'Class ID is required'),
    attendanceRecords: z.array(z.object({
      student: z.string().min(1, 'Student ID is required'),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
      remarks: z.string().max(200, 'Remarks cannot exceed 200 characters').optional(),
    })).min(1, 'At least one attendance record is required'),
  }),
});

export const getAttendanceReportSchema = z.object({
  query: z.object({
    student: z.string().optional(),
    class: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    academicYear: z.string().optional(),
  }),
});