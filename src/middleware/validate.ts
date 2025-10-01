import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        const errors = result.error.flatten();
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation error',
            details: errors,
          },
        });
      }

      // Assign validated data back to request
      Object.assign(req, result.data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation error',
            details: error.flatten(),
          },
        });
      }
      next(error);
    }
  };
};

