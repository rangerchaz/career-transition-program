import { Router } from 'express';
import { createPlan, getPlan, regeneratePlanHandler } from '../controllers/planController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All plan routes require authentication
router.use(authenticate);

// POST /api/plans/generate - Generate career plan from intake
router.post('/generate', createPlan);

// GET /api/plans - Get user's career plan
router.get('/', getPlan);

// PUT /api/plans/:planId/regenerate - Regenerate plan or phase
router.put('/:planId/regenerate', regeneratePlanHandler);

export default router;
