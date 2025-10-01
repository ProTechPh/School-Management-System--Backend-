import { Enrollment, IEnrollment } from './enrollment.model';
import { User } from '../users/user.model';
import { Class } from '../classes/class.model';
import { Subject } from '../subjects/subject.model';
import { getPaginationOptions, getPaginationResult } from '../../utils/pagination';
import { CustomError } from '../../middleware/errorHandler';

export class EnrollmentService {
  async createEnrollment(enrollmentData: {
    student: string;
    class: string;
    subjects?: string[];
    academicYear: number;
    status?: string;
  }): Promise<IEnrollment> {
    const { student, class: classId, subjects, academicYear, status } = enrollmentData;

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ student, class: classId, academicYear });
    if (existingEnrollment) {
      throw new CustomError('Student is already enrolled in this class for this academic year', 400);
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

    // Verify subjects if provided
    if (subjects && subjects.length > 0) {
      const subjectData = await Subject.find({ _id: { $in: subjects }, class: classId });
      if (subjectData.length !== subjects.length) {
        throw new CustomError('One or more subjects not found or not assigned to this class', 400);
      }
    }

    // Create enrollment
    const newEnrollment = new Enrollment({
      student,
      class: classId,
      subjects: subjects || [],
      academicYear,
      status: status || 'ACTIVE',
    });

    return await newEnrollment.save();
  }

  async getEnrollments(query: any): Promise<{ enrollments: IEnrollment[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    if (query.student) filter.student = query.student;
    if (query.class) filter.class = query.class;
    if (query.status) filter.status = query.status;
    if (query.academicYear) filter.academicYear = parseInt(query.academicYear);

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('student', 'firstName lastName email')
        .populate('class', 'name section year')
        .populate('subjects', 'name code')
        .lean(),
      Enrollment.countDocuments(filter),
    ]);

    return getPaginationResult(enrollments, total, options) as { enrollments: IEnrollment[]; pagination: any };
  }

  async getEnrollmentById(id: string): Promise<IEnrollment> {
    const enrollment = await Enrollment.findById(id)
      .populate('student', 'firstName lastName email')
      .populate('class', 'name section year')
      .populate('subjects', 'name code');

    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    return enrollment;
  }

  async updateEnrollment(id: string, updateData: Partial<IEnrollment>): Promise<IEnrollment> {
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    // Verify subjects if being updated
    if (updateData.subjects) {
      const classData = await Class.findById(enrollment.class);
      if (classData) {
        const subjectData = await Subject.find({ _id: { $in: updateData.subjects }, class: classData._id });
        if (subjectData.length !== updateData.subjects.length) {
          throw new CustomError('One or more subjects not found or not assigned to this class', 400);
        }
      }
    }

    Object.assign(enrollment, updateData);
    return await enrollment.save();
  }

  async deleteEnrollment(id: string): Promise<void> {
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    await Enrollment.findByIdAndDelete(id);
  }

  async addSubjectToEnrollment(enrollmentId: string, subjectId: string): Promise<IEnrollment> {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    // Verify subject exists and is assigned to the class
    const subject = await Subject.findOne({ _id: subjectId, class: enrollment.class });
    if (!subject) {
      throw new CustomError('Subject not found or not assigned to this class', 404);
    }

    // Check if subject is already enrolled
    if (enrollment.subjects.includes(subjectId as any)) {
      throw new CustomError('Student is already enrolled in this subject', 400);
    }

    // Add subject to enrollment
    enrollment.subjects.push(subjectId as any);
    await enrollment.save();

    return await this.getEnrollmentById(enrollmentId);
  }

  async removeSubjectFromEnrollment(enrollmentId: string, subjectId: string): Promise<IEnrollment> {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    // Remove subject from enrollment
    enrollment.subjects = enrollment.subjects.filter(
      (id) => id.toString() !== subjectId
    );
    await enrollment.save();

    return await this.getEnrollmentById(enrollmentId);
  }

  async getStudentEnrollments(studentId: string, academicYear?: number): Promise<IEnrollment[]> {
    const filter: any = { student: studentId };
    if (academicYear) filter.academicYear = academicYear;

    return await Enrollment.find(filter)
      .populate('class', 'name section year')
      .populate('subjects', 'name code')
      .sort({ academicYear: -1, enrolledAt: -1 });
  }

  async getClassEnrollments(classId: string, academicYear?: number): Promise<IEnrollment[]> {
    const filter: any = { class: classId };
    if (academicYear) filter.academicYear = academicYear;

    return await Enrollment.find(filter)
      .populate('student', 'firstName lastName email')
      .populate('subjects', 'name code')
      .sort({ enrolledAt: 1 });
  }
}