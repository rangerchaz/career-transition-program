import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import {
  getAllAgents,
  getAgent,
  chatWithAgent,
  getAgentConversation,
} from '../services/agentService';
import { AgentChatRequest } from '../types';

/**
 * Get all available agents
 * GET /api/agents
 */
export const listAgents = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const agents = getAllAgents();
  res.status(200).json({ agents });
});

/**
 * Get specific agent details
 * GET /api/agents/:agentId
 */
export const getAgentDetails = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { agentId } = req.params;

    const agent = getAgent(agentId);

    if (!agent) {
      throw new AppError('Agent not found', 404);
    }

    res.status(200).json({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      personality: agent.personality,
      expertise: agent.expertise,
      avatar: agent.avatar,
      color: agent.color,
      description: agent.description,
    });
  }
);

/**
 * Chat with an agent
 * POST /api/agents/:agentId/chat
 */
export const chatAgent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  const { agentId } = req.params;
  const { message, context } = req.body as AgentChatRequest;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (!message || message.trim() === '') {
    throw new AppError('Message is required', 400);
  }

  const agent = getAgent(agentId);
  if (!agent) {
    throw new AppError('Agent not found', 404);
  }

  const response = await chatWithAgent(authReq.user.id, agentId, message, context);

  res.status(200).json(response);
});

/**
 * Get conversation history with an agent
 * GET /api/agents/:agentId/conversation
 */
export const getConversation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;
    const { agentId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!authReq.user) {
      throw new AppError('User not authenticated', 401);
    }

    const conversation = await getAgentConversation(authReq.user.id, agentId, limit);

    res.status(200).json(conversation);
  }
);
