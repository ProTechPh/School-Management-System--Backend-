import { Class, IClass } from './class.model';
import { User } from '../users/user.model';
import { getPaginationOptions, getPaginationResult, PaginationOptions } from '../../utils/pagination';
import { CustomError } from '../../middleware/errorHandler';

export class ClassService {
  async createClass(classData: {
    name: string;
    section: string;
    year: number;
    classTeacher: string;
    capacity?: number;
    status?: string;
  }): Promise<IClass> {
    const { name, section, year, classTeacher, capacity, status } = classData;

    // Check if class already exists
    const existingClass = await Class.findOne({ name, section, year });
    if (existingClass) {
      throw new CustomError('Class with this name, section, and year already exists', 400);
    }

    // Verify class teacher exists and is a teacher
    const teacher = await User.findById(classTeacher);
    if (!teacher) {
      throw new CustomError('Class teacher not found', 404);
    }
    if (teacher.role !== 'TEACHER') {
      throw new CustomError('Class teacher must have TEACHER role', 400);
    }

    // Create class
    const newClass = new Class({
      name,
      section,
      year,
      classTeacher,
      capacity: capacity || 30,
      status: status || 'ACTIVE',
    });

    return await newClass.save();
  }

  async getClasses(query: any): Promise<{ classes: IClass[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    if (query.year) filter.year = parseInt(query.year);
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { section: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [classes, total] = await Promise.all([
      Class.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('classTeacher', 'firstName lastName email')
        .populate('students', 'firstName lastName email')
        .populate('subjects', 'name code')
        .lean(),
      Class.countDocuments(filter),
    ]);

    return getPaginationResult(classes, total, options);
  }

  async getClassById(id: string): Promise<IClass> {
    const classData = await Class.findById(id)
      .populate('classTeacher', 'firstName lastName email')
      .populate('students', 'firstName lastName email')
      .populate('subjects', 'name code');

    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    return classData;
  }

  async updateClass(id: string, updateData: Partial<IClass>): Promise<IClass> {
    const classData = await Class.findById(id);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Check if class already exists (excluding current class)
    if (updateData.name && updateData.section && updateData.year) {
      const existingClass = await Class.findOne({
        name: updateData.name,
        section: updateData.section,
        year: updateData.year,
        _id: { $ne: id },
      });
      if (existingClass) {
        throw new CustomError('Class with this name, section, and year already exists', 400);
      }
    }

    // Verify class teacher if being updated
    if (updateData.classTeacher) {
      const teacher = await User.findById(updateData.classTeacher);
      if (!teacher) {
        throw new CustomError('Class teacher not found', 404);
      }
      if (teacher.role !== 'TEACHER') {
        throw new CustomError('Class teacher must have TEACHER role', 400);
      }
    }

    Object.assign(classData, updateData);
    return await classData.save();
  }

  async deleteClass(id: string): Promise<void> {
    const classData = await Class.findById(id);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Check if class has students
    if (classData.students.length > 0) {
      throw new CustomError('Cannot delete class with enrolled students', 400);
    }

    await Class.findByIdAndDelete(id);
  }

  async addStudentToClass(classId: string, studentId: string): Promise<IClass> {
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Verify student exists and is a student
    const student = await User.findById(studentId);
    if (!student) {
      throw new CustomError('Student not found', 404);
    }
    if (student.role !== 'STUDENT') {
      throw new CustomError('User must have STUDENT role', 400);
    }

    // Check if student is already in class
    if (classData.students.includes(studentId as any)) {
      throw new CustomError('Student is already enrolled in this class', 400);
    }

    // Check class capacity
    if (classData.students.length >= classData.capacity) {
      throw new CustomError('Class is at maximum capacity', 400);
    }

    // Add student to class
    classData.students.push(studentId as any);
    await classData.save();

    // Update student's class reference
    await User.findByIdAndUpdate(studentId, {
      'meta.class': classId,
    });

    return await this.getClassById(classId);
  }

  async removeStudentFromClass(classId: string, studentId: string): Promise<IClass> {
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Remove student from class
    classData.students = classData.students.filter(
      (id) => id.toString() !== studentId
    );
    await classData.save();

    // Remove class reference from student
    await User.findByIdAndUpdate(studentId, {
      $unset: { 'meta.class': 1 },
    });

    return await this.getClassById(classId);
  }

  async getClassStudents(classId: string): Promise<any[]> {
    const classData = await Class.findById(classId)
      .populate('students', 'firstName lastName email meta')
      .lean();

    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    return classData.students;
  }
}

