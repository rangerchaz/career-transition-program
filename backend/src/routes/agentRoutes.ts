import { Router } from 'express';
import {
  listAgents,
  getAgentDetails,
  chatAgent,
  getConversation,
} from '../controllers/agentController';
import { authenticate } from '../middleware/auth';
import { validate, agentChatSchema } from '../middleware/validation';

const router = Router();

// GET /api/agents - List all agents (public)
router.get('/', listAgents);

// GET /api/agents/:agentId - Get agent details (public)
router.get('/:agentId', getAgentDetails);

// Protected routes
router.use(authenticate);

// POST /api/agents/:agentId/chat - Chat with agent
router.post('/:agentId/chat', validate(agentChatSchema), chatAgent);

// GET /api/agents/:agentId/conversation - Get conversation history
router.get('/:agentId/conversation', getConversation);

export default router;
