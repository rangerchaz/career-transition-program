import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { generatePlan, getUserPlan, regeneratePlan } from '../services/planService';

/**
 * Generate career plan from intake session
 * POST /api/plans/generate
 */
export const createPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  const { sessionId } = req.body;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (!sessionId) {
    throw new AppError('sessionId is required', 400);
  }

  const result = await generatePlan(sessionId, authReq.user.id);

  res.status(201).json({
    planId: result.planId,
    phases: result.phases,
    message: 'Career plan generated successfully',
  });
});

/**
 * Get user's career plan
 * GET /api/plans
 */
export const getPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  const plan = await getUserPlan(authReq.user.id);

  if (!plan) {
    res.status(404).json({
      message: 'No career plan found. Please complete intake and generate a plan first.',
    });
    return;
  }

  res.status(200).json(plan);
});

/**
 * Regenerate plan or specific phase
 * PUT /api/plans/:planId/regenerate
 */
export const regeneratePlanHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;
    const { planId } = req.params;
    const { phaseNumber } = req.body;

    if (!authReq.user) {
      throw new AppError('User not authenticated', 401);
    }

    const phases = await regeneratePlan(
      planId,
      authReq.user.id,
      phaseNumber
    );

    res.status(200).json({
      phases,
      message: phaseNumber
        ? `Phase ${phaseNumber} regenerated successfully`
        : 'Plan regenerated successfully',
    });
  }
);
