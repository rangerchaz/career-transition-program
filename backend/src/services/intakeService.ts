import { sendMessage } from './anthropic';
import { prisma } from '../utils/prisma';
import { ConversationMessage, IntakeData } from '../types';
import { logger } from '../utils/logger';

// System prompt for the intake conversation
const INTAKE_SYSTEM_PROMPT = `You are a career transition assistant conducting an intake interview to help someone switch careers.

Your goal is to gather the following information through natural conversation:
1. Current role/position
2. Target role/career they want to transition to
3. Timeline (when they want to make the transition)
4. Current skills and experience
5. Education background
6. Constraints (time availability, budget, location preferences)
7. Motivations for the career change

Guidelines:
- Ask ONE question at a time
- Keep questions conversational and friendly
- Build on previous answers naturally
- Don't make it feel like a form - make it feel like a helpful conversation
- After gathering all information, say "Thank you! I have all the information I need to create your personalized career transition plan."
- Be encouraging and supportive
- If user provides multiple pieces of information in one response, acknowledge all of them
- Total conversation should be 7-10 questions

Return your response as plain text - just the next question or acknowledgment.`;

/**
 * Start a new intake session for a user
 */
export async function startIntakeSession(userId: string): Promise<{
  sessionId: string;
  firstQuestion: string;
}> {
  // Check if user already has an active incomplete session
  const existingSession = await prisma.intakeSession.findFirst({
    where: {
      userId,
      isComplete: false,
    },
  });

  if (existingSession) {
    // Return the existing session with a contextual question
    const conversationHistory = existingSession.conversationHistory as ConversationMessage[];
    const lastMessage = conversationHistory && conversationHistory.length > 0
      ? conversationHistory[conversationHistory.length - 1]
      : null;

    return {
      sessionId: existingSession.id,
      firstQuestion: lastMessage && lastMessage.role === 'assistant'
        ? lastMessage.content
        : "Let's continue where we left off. Could you tell me more about your current role?",
    };
  }

  // Create new session
  const session = await prisma.intakeSession.create({
    data: {
      userId,
      conversationHistory: [],
      currentStep: 0,
      isComplete: false,
      collectedData: {},
    },
  });

  // Generate first question using Claude
  const firstQuestion = await sendMessage(
    INTAKE_SYSTEM_PROMPT,
    [
      {
        role: 'user',
        content: 'Hi, I want to start planning my career transition.',
      },
    ],
    1024
  );

  // Save first question to conversation history
  const conversationHistory: ConversationMessage[] = [
    {
      role: 'user',
      content: 'Hi, I want to start planning my career transition.',
      timestamp: new Date(),
    },
    {
      role: 'assistant',
      content: firstQuestion,
      timestamp: new Date(),
    },
  ];

  await prisma.intakeSession.update({
    where: { id: session.id },
    data: {
      conversationHistory: conversationHistory as never,
      currentStep: 1,
    },
  });

  logger.info('Started intake session', { userId, sessionId: session.id });

  return {
    sessionId: session.id,
    firstQuestion,
  };
}

/**
 * Process user's message and get next question
 */
export async function processIntakeMessage(
  sessionId: string,
  userId: string,
  userMessage: string
): Promise<{
  response: string;
  isComplete: boolean;
  currentStep: number;
}> {
  // Get session
  const session = await prisma.intakeSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new Error('Intake session not found');
  }

  if (session.isComplete) {
    return {
      response: 'This intake session is already complete. You can now generate your career plan!',
      isComplete: true,
      currentStep: session.currentStep,
    };
  }

  // Get conversation history
  const conversationHistory = (session.conversationHistory as ConversationMessage[]) || [];

  // Add user message to history
  conversationHistory.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  });

  // Prepare messages for Claude (convert to Claude's format)
  const claudeMessages = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Get response from Claude
  const assistantResponse = await sendMessage(
    INTAKE_SYSTEM_PROMPT,
    claudeMessages,
    1024
  );

  // Add assistant response to history
  conversationHistory.push({
    role: 'assistant',
    content: assistantResponse,
    timestamp: new Date(),
  });

  // Check if intake is complete (look for completion phrase)
  const isComplete = assistantResponse.toLowerCase().includes('i have all the information i need');

  // Extract collected data from conversation
  let collectedData = session.collectedData as IntakeData;
  if (isComplete) {
    collectedData = await extractIntakeData(conversationHistory);
  }

  // Update session
  await prisma.intakeSession.update({
    where: { id: sessionId },
    data: {
      conversationHistory: conversationHistory as never,
      currentStep: session.currentStep + 1,
      isComplete,
      collectedData: collectedData as never,
    },
  });

  logger.info('Processed intake message', {
    sessionId,
    userId,
    currentStep: session.currentStep + 1,
    isComplete,
  });

  return {
    response: assistantResponse,
    isComplete,
    currentStep: session.currentStep + 1,
  };
}

/**
 * Extract structured data from conversation history
 */
async function extractIntakeData(
  conversationHistory: ConversationMessage[]
): Promise<IntakeData> {
  // Create a prompt to extract structured data
  const extractionPrompt = `Based on the following conversation, extract structured information about the user's career transition.

Conversation:
${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}

Extract and return a JSON object with the following fields (use null if not mentioned):
{
  "currentRole": "their current job/role",
  "targetRole": "the role/career they want to transition to",
  "timeline": "when they want to make the transition",
  "skills": ["array", "of", "current", "skills"],
  "experience": "summary of their experience",
  "education": "their education background",
  "motivations": "why they want to make this change",
  "constraints": {
    "time": "time availability",
    "budget": "budget constraints",
    "location": "location preferences"
  }
}

Return ONLY the JSON object, no other text.`;

  const response = await sendMessage(
    'You are a data extraction assistant. Extract information and return valid JSON only.',
    [{ role: 'user', content: extractionPrompt }],
    2048
  );

  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return data as IntakeData;
    }
  } catch (error) {
    logger.error('Failed to extract intake data', { error });
  }

  // Return empty object if extraction fails
  return {};
}

/**
 * Get intake session details
 */
export async function getIntakeSession(sessionId: string, userId: string) {
  const session = await prisma.intakeSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new Error('Intake session not found');
  }

  return {
    id: session.id,
    conversationHistory: session.conversationHistory as ConversationMessage[],
    currentStep: session.currentStep,
    isComplete: session.isComplete,
    collectedData: session.collectedData as IntakeData,
  };
}
