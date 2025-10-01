import { Attendance, IAttendance } from './attendance.model';
import { User } from '../users/user.model';
import { Class } from '../classes/class.model';
import { getPaginationOptions, getPaginationResult } from '../../utils/pagination';
import { CustomError } from '../../middleware/errorHandler';

export class AttendanceService {
  async createAttendance(attendanceData: {
    date: string;
    class: string;
    student: string;
    status: string;
    markedBy: string;
    remarks?: string;
  }): Promise<IAttendance> {
    const { date, class: classId, student, status, markedBy, remarks } = attendanceData;

    // Check if attendance already exists for this date, class, and student
    const existingAttendance = await Attendance.findOne({
      date: new Date(date),
      class: classId,
      student,
    });
    if (existingAttendance) {
      throw new CustomError('Attendance already marked for this student on this date', 400);
    }

    // Verify student exists and is a student
    const studentData = await User.findById(student);
    if (!studentData) {
      throw new CustomError('Student not found', 404);
    }
    if (studentData.role !== 'STUDENT') {
      throw new CustomError('User must have STUDENT role', 400);
    }

    // Verify class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Verify markedBy user exists
    const markedByUser = await User.findById(markedBy);
    if (!markedByUser) {
      throw new CustomError('User who marked attendance not found', 404);
    }

    // Create attendance record
    const newAttendance = new Attendance({
      date: new Date(date),
      class: classId,
      student,
      status,
      markedBy,
      remarks,
    });

    return await newAttendance.save();
  }

  async getAttendances(query: any): Promise<{ attendances: IAttendance[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    if (query.class) filter.class = query.class;
    if (query.student) filter.student = query.student;
    if (query.status) filter.status = query.status;
    if (query.markedBy) filter.markedBy = query.markedBy;
    if (query.date) filter.date = new Date(query.date);
    
    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) filter.date.$gte = new Date(query.startDate);
      if (query.endDate) filter.date.$lte = new Date(query.endDate);
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [attendances, total] = await Promise.all([
      Attendance.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('class', 'name section year')
        .populate('student', 'firstName lastName email')
        .populate('markedBy', 'firstName lastName email')
        .lean(),
      Attendance.countDocuments(filter),
    ]);

    return getPaginationResult(attendances, total, options) as { attendances: IAttendance[]; pagination: any };
  }

  async getAttendanceById(id: string): Promise<IAttendance> {
    const attendance = await Attendance.findById(id)
      .populate('class', 'name section year')
      .populate('student', 'firstName lastName email')
      .populate('markedBy', 'firstName lastName email');

    if (!attendance) {
      throw new CustomError('Attendance record not found', 404);
    }

    return attendance;
  }

  async updateAttendance(id: string, updateData: Partial<IAttendance>): Promise<IAttendance> {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      throw new CustomError('Attendance record not found', 404);
    }

    Object.assign(attendance, updateData);
    return await attendance.save();
  }

  async deleteAttendance(id: string): Promise<void> {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      throw new CustomError('Attendance record not found', 404);
    }

    await Attendance.findByIdAndDelete(id);
  }

  async markBulkAttendance(bulkData: {
    date: string;
    class: string;
    attendanceRecords: Array<{
      student: string;
      status: string;
      remarks?: string;
    }>;
    markedBy: string;
  }): Promise<IAttendance[]> {
    const { date, class: classId, attendanceRecords, markedBy } = bulkData;

    // Verify class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Verify markedBy user exists
    const markedByUser = await User.findById(markedBy);
    if (!markedByUser) {
      throw new CustomError('User who marked attendance not found', 404);
    }

    const attendanceDate = new Date(date);
    const createdAttendances: IAttendance[] = [];

    for (const record of attendanceRecords) {
      // Check if attendance already exists
      const existingAttendance = await Attendance.findOne({
        date: attendanceDate,
        class: classId,
        student: record.student,
      });

      if (existingAttendance) {
        // Update existing attendance
        existingAttendance.status = record.status as any;
        existingAttendance.remarks = record.remarks;
        existingAttendance.markedBy = markedBy as any;
        await existingAttendance.save();
        createdAttendances.push(existingAttendance);
      } else {
        // Create new attendance
        const newAttendance = new Attendance({
          date: attendanceDate,
          class: classId,
          student: record.student,
          status: record.status as any,
          markedBy,
          remarks: record.remarks,
        });
        await newAttendance.save();
        createdAttendances.push(newAttendance);
      }
    }

    return createdAttendances;
  }

  async getAttendanceReport(query: any): Promise<any> {
    const { student, class: classId, startDate, endDate, academicYear } = query;

    // Build filter
    const filter: any = {};
    if (student) filter.student = student;
    if (classId) filter.class = classId;
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Get attendance records
    const attendances = await Attendance.find(filter)
      .populate('class', 'name section year')
      .populate('student', 'firstName lastName email')
      .sort({ date: -1 });

    // Calculate statistics
    const totalRecords = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendances.filter(a => a.status === 'ABSENT').length;
    const lateCount = attendances.filter(a => a.status === 'LATE').length;
    const excusedCount = attendances.filter(a => a.status === 'EXCUSED').length;

    const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    return {
      summary: {
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
      },
      records: attendances,
    };
  }

  async getStudentAttendance(studentId: string, startDate?: string, endDate?: string): Promise<IAttendance[]> {
    const filter: any = { student: studentId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    return await Attendance.find(filter)
      .populate('class', 'name section year')
      .populate('markedBy', 'firstName lastName email')
      .sort({ date: -1 });
  }

  async getClassAttendance(classId: string, date?: string): Promise<IAttendance[]> {
    const filter: any = { class: classId };
    if (date) filter.date = new Date(date);

    return await Attendance.find(filter)
      .populate('student', 'firstName lastName email')
      .populate('markedBy', 'firstName lastName email')
      .sort({ date: -1, 'student.firstName': 1 });
  }
}