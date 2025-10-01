import { Exam, IExam } from './exam.model';
import { Grade, IGrade } from './grade.model';
import { User } from '../users/user.model';
import { Class } from '../classes/class.model';
import { Subject } from '../subjects/subject.model';
import { getPaginationOptions, getPaginationResult } from '../../utils/pagination';
import { CustomError } from '../../middleware/errorHandler';

export class ExamsService {
  // Exam methods
  async createExam(examData: {
    name: string;
    class: string;
    subject: string;
    date: string;
    maxMarks: number;
    duration: number;
    examType: string;
    instructions?: string;
    status?: string;
    createdBy: string;
  }): Promise<IExam> {
    const { name, class: classId, subject, date, maxMarks, duration, examType, instructions, status, createdBy } = examData;

    // Verify class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new CustomError('Class not found', 404);
    }

    // Verify subject exists and is assigned to the class
    const subjectData = await Subject.findOne({ _id: subject, class: classId });
    if (!subjectData) {
      throw new CustomError('Subject not found or not assigned to this class', 404);
    }

    // Verify createdBy user exists
    const createdByUser = await User.findById(createdBy);
    if (!createdByUser) {
      throw new CustomError('User not found', 404);
    }

    // Create exam
    const newExam = new Exam({
      name,
      class: classId,
      subject,
      date: new Date(date),
      maxMarks,
      duration,
      examType,
      instructions,
      status: status || 'SCHEDULED',
      createdBy,
    });

    return await newExam.save();
  }

  async getExams(query: any): Promise<{ exams: IExam[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    if (query.class) filter.class = query.class;
    if (query.subject) filter.subject = query.subject;
    if (query.examType) filter.examType = query.examType;
    if (query.status) filter.status = query.status;
    
    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) filter.date.$gte = new Date(query.startDate);
      if (query.endDate) filter.date.$lte = new Date(query.endDate);
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [exams, total] = await Promise.all([
      Exam.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('class', 'name section year')
        .populate('subject', 'name code')
        .populate('createdBy', 'firstName lastName email')
        .lean(),
      Exam.countDocuments(filter),
    ]);

    return getPaginationResult(exams, total, options) as { exams: IExam[]; pagination: any };
  }

  async getExamById(id: string): Promise<IExam> {
    const exam = await Exam.findById(id)
      .populate('class', 'name section year')
      .populate('subject', 'name code')
      .populate('createdBy', 'firstName lastName email');

    if (!exam) {
      throw new CustomError('Exam not found', 404);
    }

    return exam;
  }

  async updateExam(id: string, updateData: Partial<IExam>): Promise<IExam> {
    const exam = await Exam.findById(id);
    if (!exam) {
      throw new CustomError('Exam not found', 404);
    }

    Object.assign(exam, updateData);
    return await exam.save();
  }

  async deleteExam(id: string): Promise<void> {
    const exam = await Exam.findById(id);
    if (!exam) {
      throw new CustomError('Exam not found', 404);
    }

    // Delete associated grades
    await Grade.deleteMany({ exam: id });
    
    // Delete exam
    await Exam.findByIdAndDelete(id);
  }

  // Grade methods
  async createGrade(gradeData: {
    exam: string;
    student: string;
    marks: number;
    remarks?: string;
    gradedBy: string;
  }): Promise<IGrade> {
    const { exam, student, marks, remarks, gradedBy } = gradeData;

    // Check if grade already exists
    const existingGrade = await Grade.findOne({ exam, student });
    if (existingGrade) {
      throw new CustomError('Grade already exists for this student in this exam', 400);
    }

    // Verify exam exists
    const examData = await Exam.findById(exam);
    if (!examData) {
      throw new CustomError('Exam not found', 404);
    }

    // Verify student exists and is a student
    const studentData = await User.findById(student);
    if (!studentData) {
      throw new CustomError('Student not found', 404);
    }
    if (studentData.role !== 'STUDENT') {
      throw new CustomError('User must have STUDENT role', 400);
    }

    // Verify marks don't exceed max marks
    if (marks > examData.maxMarks) {
      throw new CustomError('Marks cannot exceed maximum marks for this exam', 400);
    }

    // Verify gradedBy user exists
    const gradedByUser = await User.findById(gradedBy);
    if (!gradedByUser) {
      throw new CustomError('User not found', 404);
    }

    // Create grade
    const newGrade = new Grade({
      exam,
      student,
      marks,
      remarks,
      gradedBy,
    });

    return await newGrade.save();
  }

  async getGrades(query: any): Promise<{ grades: IGrade[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    if (query.exam) filter.exam = query.exam;
    if (query.student) filter.student = query.student;
    if (query.grade) filter.grade = query.grade;

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [grades, total] = await Promise.all([
      Grade.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('exam', 'name date maxMarks examType')
        .populate('student', 'firstName lastName email')
        .populate('gradedBy', 'firstName lastName email')
        .lean(),
      Grade.countDocuments(filter),
    ]);

    return getPaginationResult(grades, total, options) as { grades: IGrade[]; pagination: any };
  }

  async getGradeById(id: string): Promise<IGrade> {
    const grade = await Grade.findById(id)
      .populate('exam', 'name date maxMarks examType')
      .populate('student', 'firstName lastName email')
      .populate('gradedBy', 'firstName lastName email');

    if (!grade) {
      throw new CustomError('Grade not found', 404);
    }

    return grade;
  }

  async updateGrade(id: string, updateData: Partial<IGrade>): Promise<IGrade> {
    const grade = await Grade.findById(id);
    if (!grade) {
      throw new CustomError('Grade not found', 404);
    }

    // If marks are being updated, verify they don't exceed max marks
    if (updateData.marks !== undefined) {
      const exam = await Exam.findById(grade.exam);
      if (exam && updateData.marks > exam.maxMarks) {
        throw new CustomError('Marks cannot exceed maximum marks for this exam', 400);
      }
    }

    Object.assign(grade, updateData);
    return await grade.save();
  }

  async deleteGrade(id: string): Promise<void> {
    const grade = await Grade.findById(id);
    if (!grade) {
      throw new CustomError('Grade not found', 404);
    }

    await Grade.findByIdAndDelete(id);
  }

  async getExamGrades(examId: string): Promise<IGrade[]> {
    // Verify exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new CustomError('Exam not found', 404);
    }

    return await Grade.find({ exam: examId })
      .populate('student', 'firstName lastName email')
      .populate('gradedBy', 'firstName lastName email')
      .sort({ 'student.firstName': 1 });
  }

  async getStudentGrades(query: any): Promise<IGrade[]> {
    const { student, class: classId, subject, examType, startDate, endDate } = query;

    // Build filter for exams
    const examFilter: any = {};
    if (classId) examFilter.class = classId;
    if (subject) examFilter.subject = subject;
    if (examType) examFilter.examType = examType;
    if (startDate || endDate) {
      examFilter.date = {};
      if (startDate) examFilter.date.$gte = new Date(startDate);
      if (endDate) examFilter.date.$lte = new Date(endDate);
    }

    // Get exam IDs that match the filter
    const exams = await Exam.find(examFilter).select('_id');
    const examIds = exams.map(exam => exam._id);

    // Get grades for the student in these exams
    return await Grade.find({ student, exam: { $in: examIds } })
      .populate('exam', 'name date maxMarks examType')
      .populate('gradedBy', 'firstName lastName email')
      .sort({ 'exam.date': -1 });
  }

  async getGradeStatistics(examId: string): Promise<any> {
    const grades = await Grade.find({ exam: examId });
    const exam = await Exam.findById(examId);

    if (!exam) {
      throw new CustomError('Exam not found', 404);
    }

    if (grades.length === 0) {
      return {
        totalStudents: 0,
        gradedStudents: 0,
        averageMarks: 0,
        highestMarks: 0,
        lowestMarks: 0,
        gradeDistribution: {},
      };
    }

    const marks = grades.map(g => g.marks);
    const averageMarks = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    const highestMarks = Math.max(...marks);
    const lowestMarks = Math.min(...marks);

    // Grade distribution
    const gradeDistribution: any = {};
    grades.forEach(grade => {
      gradeDistribution[grade.grade] = (gradeDistribution[grade.grade] || 0) + 1;
    });

    return {
      totalStudents: grades.length,
      gradedStudents: grades.length,
      averageMarks: Math.round(averageMarks * 100) / 100,
      highestMarks,
      lowestMarks,
      gradeDistribution,
    };
  }
}