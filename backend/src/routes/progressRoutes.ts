import { Router } from 'express';
import {
  getProgress,
  getDetailedProgressHandler,
  updateTask,
  completeMilestoneHandler,
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';
import { validate, updateProgressSchema } from '../middleware/validation';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

// GET /api/progress - Get progress statistics
router.get('/', getProgress);

// GET /api/progress/detailed - Get detailed progress breakdown
router.get('/detailed', getDetailedProgressHandler);

// PUT /api/progress/task - Update task completion
router.put('/task', validate(updateProgressSchema), updateTask);

// POST /api/progress/milestone/:milestoneId/complete - Complete milestone
router.post('/milestone/:milestoneId/complete', completeMilestoneHandler);

export default router;
