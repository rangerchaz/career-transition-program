import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import {
  startIntakeSession,
  processIntakeMessage,
  getIntakeSession,
} from '../services/intakeService';
import { IntakeMessageRequest, IntakeMessageResponse } from '../types';

/**
 * Start a new intake session
 * POST /api/intake/start
 */
export const startIntake = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  const result = await startIntakeSession(authReq.user.id);

  res.status(200).json({
    sessionId: result.sessionId,
    question: result.firstQuestion,
    currentStep: 1,
    isComplete: false,
  });
});

/**
 * Send message and get next question
 * POST /api/intake/:sessionId/message
 */
export const sendIntakeMessage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;
    const { sessionId } = req.params;
    const { message } = req.body as IntakeMessageRequest;

    if (!authReq.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!message || message.trim() === '') {
      throw new AppError('Message is required', 400);
    }

    const result = await processIntakeMessage(sessionId, authReq.user.id, message);

    const response: IntakeMessageResponse = {
      question: result.response,
      isComplete: result.isComplete,
      currentStep: result.currentStep,
    };

    res.status(200).json(response);
  }
);

/**
 * Get intake session details
 * GET /api/intake/:sessionId
 */
export const getIntake = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  const { sessionId } = req.params;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  const session = await getIntakeSession(sessionId, authReq.user.id);

  res.status(200).json(session);
});
