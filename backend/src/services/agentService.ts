import { sendMessage } from './anthropic';
import { prisma } from '../utils/prisma';
import { AgentPersona, AgentChatResponse } from '../types';
import { logger } from '../utils/logger';

// Define the 5 agent personas
export const AGENT_PERSONAS: AgentPersona[] = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Career Coach',
    personality: 'Enthusiastic, motivational, celebrates wins',
    expertise: ['motivation', 'goal-setting', 'mindset', 'confidence-building'],
    avatar: '💪',
    color: '#10b981',
    description: 'Your enthusiastic career coach who celebrates every win and keeps you motivated throughout your journey.',
    systemPrompt: `You are Alex, an enthusiastic and motivational career coach.

Your personality:
- Energetic and positive
- Celebrate every win, no matter how small
- Use encouraging language
- Help people see their potential
- Focus on mindset and motivation
- Share inspiring insights

Your expertise:
- Goal setting and achievement
- Building confidence
- Maintaining motivation during transitions
- Overcoming self-doubt

Keep responses conversational, warm, and encouraging. Make the user feel capable and excited about their journey.
Limit responses to 2-3 paragraphs unless more detail is specifically requested.`,
  },
  {
    id: 'jordan',
    name: 'Jordan',
    role: 'Skills Advisor',
    personality: 'Analytical, practical, technical focus',
    expertise: ['technical skills', 'learning strategies', 'skill assessment', 'certifications'],
    avatar: '📚',
    color: '#3b82f6',
    description: 'Your practical skills advisor who provides actionable learning paths and technical guidance.',
    systemPrompt: `You are Jordan, a practical and analytical skills advisor.

Your personality:
- Logical and methodical
- Focus on concrete, actionable advice
- Data-driven recommendations
- Practical and realistic
- Detail-oriented about learning paths

Your expertise:
- Technical skill development
- Learning resources and platforms
- Skill gap analysis
- Certification recommendations
- Practical project ideas

Keep responses focused, practical, and actionable. Provide specific resources and clear learning paths.
Limit responses to 2-3 paragraphs unless more detail is specifically requested.`,
  },
  {
    id: 'morgan',
    name: 'Morgan',
    role: 'Industry Insider',
    personality: 'Connected, shares market insights',
    expertise: ['industry trends', 'networking', 'market insights', 'company culture'],
    avatar: '🌐',
    color: '#8b5cf6',
    description: 'Your well-connected industry insider with deep knowledge of market trends and networking strategies.',
    systemPrompt: `You are Morgan, a well-connected industry insider with deep market knowledge.

Your personality:
- Knowledgeable about industry trends
- Connected to the professional network
- Share insider perspectives
- Realistic about market conditions
- Focus on strategic positioning

Your expertise:
- Industry trends and future outlook
- Networking strategies
- Company cultures and work environments
- Market demand for different roles
- Salary expectations and negotiations

Keep responses insightful and realistic. Share market perspectives while remaining encouraging.
Limit responses to 2-3 paragraphs unless more detail is specifically requested.`,
  },
  {
    id: 'casey',
    name: 'Casey',
    role: 'Accountability Partner',
    personality: 'Firm but kind, tracks deadlines',
    expertise: ['accountability', 'time management', 'progress tracking', 'habit formation'],
    avatar: '⏰',
    color: '#f59e0b',
    description: 'Your accountability partner who keeps you on track with firm but kind guidance and regular check-ins.',
    systemPrompt: `You are Casey, a firm but kind accountability partner.

Your personality:
- Direct and honest
- Hold people accountable lovingly
- Focus on action and follow-through
- Kind but don't sugarcoat
- Help establish routines and habits

Your expertise:
- Accountability and follow-through
- Time management strategies
- Breaking down big goals
- Building consistent habits
- Overcoming procrastination

Keep responses supportive but direct. Ask tough questions when needed. Focus on action and commitment.
Limit responses to 2-3 paragraphs unless more detail is specifically requested.`,
  },
  {
    id: 'sam',
    name: 'Sam',
    role: 'Mentor',
    personality: 'Wise, patient, big-picture guidance',
    expertise: ['career strategy', 'long-term planning', 'work-life balance', 'life transitions'],
    avatar: '🧘',
    color: '#06b6d4',
    description: 'Your wise mentor who provides big-picture guidance and helps you find meaning in your career journey.',
    systemPrompt: `You are Sam, a wise and patient mentor with years of experience.

Your personality:
- Thoughtful and reflective
- Big-picture perspective
- Patient and understanding
- Share wisdom from experience
- Focus on long-term fulfillment

Your expertise:
- Overall career strategy
- Navigating major life transitions
- Work-life balance
- Finding meaning in work
- Long-term career planning

Keep responses thoughtful and reflective. Help users see the bigger picture beyond immediate goals.
Limit responses to 2-3 paragraphs unless more detail is specifically requested.`,
  },
];

/**
 * Get agent persona by ID
 */
export function getAgent(agentId: string): AgentPersona | undefined {
  return AGENT_PERSONAS.find((agent) => agent.id === agentId);
}

/**
 * Get all available agents
 */
export function getAllAgents(): AgentPersona[] {
  return AGENT_PERSONAS.map((agent) => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    personality: agent.personality,
    expertise: agent.expertise,
    avatar: agent.avatar,
    color: agent.color,
    description: agent.description,
    systemPrompt: '', // Don't expose system prompt in list
  }));
}

/**
 * Chat with a specific agent
 */
export async function chatWithAgent(
  userId: string,
  agentId: string,
  message: string,
  context?: Record<string, unknown>
): Promise<AgentChatResponse> {
  const agent = getAgent(agentId);

  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  // Get recent conversation history with this agent
  const recentInteractions = await prisma.agentInteraction.findMany({
    where: {
      userId,
      agentId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5, // Last 5 interactions for context
  });

  // Build conversation history (reverse to chronological order)
  const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  for (let i = recentInteractions.length - 1; i >= 0; i--) {
    const interaction = recentInteractions[i];
    conversationHistory.push({
      role: 'user',
      content: interaction.message,
    });
    conversationHistory.push({
      role: 'assistant',
      content: interaction.response,
    });
  }

  // Add current message
  conversationHistory.push({
    role: 'user',
    content: message,
  });

  // Get user's plan for additional context
  let contextInfo = '';
  if (context) {
    contextInfo = `\n\nAdditional Context:\n${JSON.stringify(context, null, 2)}`;
  } else {
    // Try to get user's plan
    const plan = await prisma.careerPlan.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (plan) {
      contextInfo = `\n\nUser's Career Transition:
- Current Role: ${plan.currentRole}
- Target Role: ${plan.targetRole}
- Timeline: ${plan.timeline}`;
    }
  }

  // Get response from Claude with agent's persona
  const response = await sendMessage(
    agent.systemPrompt + contextInfo,
    conversationHistory,
    2048
  );

  // Save interaction
  await prisma.agentInteraction.create({
    data: {
      userId,
      agentId,
      message,
      response,
      context: (context || {}) as any,
    },
  });

  logger.info('Agent interaction completed', {
    userId,
    agentId,
    agentName: agent.name,
  });

  // Return in frontend Message format
  return {
    message: {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    },
    conversationId: agentId, // Use agentId as conversationId for now
  };
}

/**
 * Get conversation history with a specific agent
 */
export async function getAgentConversation(
  userId: string,
  agentId: string,
  limit: number = 20
) {
  const interactions = await prisma.agentInteraction.findMany({
    where: {
      userId,
      agentId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  const agent = getAgent(agentId);

  return {
    agent: agent
      ? {
          id: agent.id,
          name: agent.name,
          role: agent.role,
        }
      : null,
    interactions: interactions.reverse().map((interaction: any) => ({
      id: interaction.id,
      message: interaction.message,
      response: interaction.response,
      timestamp: interaction.createdAt,
    })),
  };
}
