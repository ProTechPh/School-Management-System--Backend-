import { Subject, ISubject } from './subject.model';
import { User } from '../users/user.model';
import { Class } from '../classes/class.model';
import { getPaginationOptions, getPaginationResult } from '../../utils/pagination';
import { CustomError } from '../../middleware/errorHandler';

export class SubjectService {
  async createSubject(subjectData: {
    name: string;
    code: string;
    class: string;
    teacher: string;
    description?: string;
    credits?: number;
    status?: string;
  }): Promise<ISubject> {
    const { name, code, class: classId, teacher, description, credits, status } = subjectData;

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ code, class: classId });
    if (existingSubject) {
      throw new CustomError('Subject with this code already exists in this class', 400);
    }

    // Verify class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Verify teacher exists and is a teacher
    const teacherData = await User.findById(teacher);
    if (!teacherData) {
      throw new CustomError('Teacher not found', 404);
    }
    if (teacherData.role !== 'TEACHER') {
      throw new CustomError('Teacher must have TEACHER role', 400);
    }

    // Create subject
    const newSubject = new Subject({
      name,
      code: code.toUpperCase(),
      class: classId,
      teacher,
      description,
      credits: credits || 1,
      status: status || 'ACTIVE',
    });

    return await newSubject.save();
  }

  async getSubjects(query: any): Promise<{ subjects: ISubject[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    if (query.class) filter.class = query.class;
    if (query.teacher) filter.teacher = query.teacher;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { code: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [subjects, total] = await Promise.all([
      Subject.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('class', 'name section year')
        .populate('teacher', 'firstName lastName email')
        .lean(),
      Subject.countDocuments(filter),
    ]);

    return getPaginationResult(subjects, total, options);
  }

  async getSubjectById(id: string): Promise<ISubject> {
    const subject = await Subject.findById(id)
      .populate('class', 'name section year')
      .populate('teacher', 'firstName lastName email');

    if (!subject) {
      throw new CustomError('Subject not found', 404);
    }

    return subject;
  }

  async updateSubject(id: string, updateData: Partial<ISubject>): Promise<ISubject> {
    const subject = await Subject.findById(id);
    if (!subject) {
      throw new CustomError('Subject not found', 404);
    }

    // Check if subject already exists (excluding current subject)
    if (updateData.code && updateData.class) {
      const existingSubject = await Subject.findOne({
        code: updateData.code,
        class: updateData.class,
        _id: { $ne: id },
      });
      if (existingSubject) {
        throw new CustomError('Subject with this code already exists in this class', 400);
      }
    }

    // Verify class if being updated
    if (updateData.class) {
      const classData = await Class.findById(updateData.class);
      if (!classData) {
        throw new CustomError('Class not found', 404);
      }
    }

    // Verify teacher if being updated
    if (updateData.teacher) {
      const teacherData = await User.findById(updateData.teacher);
      if (!teacherData) {
        throw new CustomError('Teacher not found', 404);
      }
      if (teacherData.role !== 'TEACHER') {
        throw new CustomError('Teacher must have TEACHER role', 400);
      }
    }

    Object.assign(subject, updateData);
    return await subject.save();
  }

  async deleteSubject(id: string): Promise<void> {
    const subject = await Subject.findById(id);
    if (!subject) {
      throw new CustomError('Subject not found', 404);
    }

    await Subject.findByIdAndDelete(id);
  }
}

