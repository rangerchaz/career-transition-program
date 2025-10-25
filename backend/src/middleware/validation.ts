import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation middleware factory
export const validate = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req.body;

      // Check required fields
      if (schema.required) {
        for (const field of schema.required) {
          if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            throw new AppError(`${field} is required`, 400);
          }
        }
      }

      // Validate email if present
      if (schema.email && data.email) {
        if (!EMAIL_REGEX.test(data.email)) {
          throw new AppError('Invalid email format', 400);
        }
      }

      // Validate password strength if present
      if (schema.password && data.password) {
        if (data.password.length < 8) {
          throw new AppError('Password must be at least 8 characters long', 400);
        }
      }

      // Validate custom rules
      if (schema.custom) {
        for (const rule of schema.custom) {
          if (!rule.validator(data)) {
            throw new AppError(rule.message, 400);
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

interface ValidationSchema {
  required?: string[];
  email?: boolean;
  password?: boolean;
  custom?: Array<{
    validator: (data: unknown) => boolean;
    message: string;
  }>;
}

// Common validation schemas
export const registerSchema: ValidationSchema = {
  required: ['email', 'name', 'password'],
  email: true,
  password: true,
};

export const loginSchema: ValidationSchema = {
  required: ['email', 'password'],
  email: true,
};

export const intakeMessageSchema: ValidationSchema = {
  required: ['message'],
};

export const agentChatSchema: ValidationSchema = {
  required: ['message'],
};

export const updateProgressSchema: ValidationSchema = {
  required: ['taskId', 'completed'],
  custom: [
    {
      validator: (data: unknown) => {
        const { completed } = data as { completed: unknown };
        return typeof completed === 'boolean';
      },
      message: 'completed must be a boolean',
    },
  ],
};
