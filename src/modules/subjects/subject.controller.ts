import { Request, Response, NextFunction } from 'express';
import { SubjectService } from './subject.service';

export class SubjectController {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService();
  }

  getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.subjectService.getSubjects(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getSubjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subject = await this.subjectService.getSubjectById(req.params.id);
      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  };

  createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subject = await this.subjectService.createSubject(req.body);
      res.status(201).json({
        success: true,
        data: subject,
        message: 'Subject created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subject = await this.subjectService.updateSubject(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: subject,
        message: 'Subject updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.subjectService.deleteSubject(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Subject deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

