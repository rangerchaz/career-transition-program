import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import {
  getProgressStats,
  updateTaskCompletion,
  completeMilestone,
  getDetailedProgress,
  getDashboardProgress,
} from '../services/progressService';
import { UpdateProgressRequest } from '../types';

/**
 * Get user's progress statistics
 * GET /api/progress
 */
export const getProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  const stats = await getDashboardProgress(authReq.user.id);

  if (!stats) {
    res.status(404).json({
      message: 'No progress found. Please generate a career plan first.',
    });
    return;
  }

  res.status(200).json(stats);
});

/**
 * Get detailed progress breakdown
 * GET /api/progress/detailed
 */
export const getDetailedProgressHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      throw new AppError('User not authenticated', 401);
    }

    const progress = await getDetailedProgress(authReq.user.id);

    if (!progress) {
      res.status(404).json({
        message: 'No progress found. Please generate a career plan first.',
      });
      return;
    }

    res.status(200).json(progress);
  }
);

/**
 * Update task completion
 * PUT /api/progress/task
 */
export const updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  const { taskId, completed, milestoneId } = req.body as UpdateProgressRequest;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  const stats = await updateTaskCompletion(
    authReq.user.id,
    taskId,
    completed,
    milestoneId
  );

  res.status(200).json({
    ...stats,
    message: completed ? 'Task marked as complete!' : 'Task unmarked',
  });
});

/**
 * Complete entire milestone
 * POST /api/progress/milestone/:milestoneId/complete
 */
export const completeMilestoneHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;
    const { milestoneId } = req.params;

    if (!authReq.user) {
      throw new AppError('User not authenticated', 401);
    }

    const stats = await completeMilestone(authReq.user.id, milestoneId);

    res.status(200).json({
      ...stats,
      message: 'Milestone completed! Great job!',
    });
  }
);
