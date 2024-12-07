import { z } from 'zod';

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};