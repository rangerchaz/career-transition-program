import { Router } from 'express';
import {
  startIntake,
  sendIntakeMessage,
  getIntake,
} from '../controllers/intakeController';
import { authenticate } from '../middleware/auth';
import { validate, intakeMessageSchema } from '../middleware/validation';

const router = Router();

// All intake routes require authentication
router.use(authenticate);

// POST /api/intake/start - Start new intake session
router.post('/start', startIntake);

// POST /api/intake/:sessionId/message - Send message in intake conversation
router.post('/:sessionId/message', validate(intakeMessageSchema), sendIntakeMessage);

// GET /api/intake/:sessionId - Get intake session details
router.get('/:sessionId', getIntake);

export default router;
