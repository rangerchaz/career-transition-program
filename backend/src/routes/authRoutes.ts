import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login - Login user
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me - Get current user info (protected)
router.get('/me', authenticate, getCurrentUser);

export default router;
