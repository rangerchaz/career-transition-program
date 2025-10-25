import { sendMessage } from './anthropic';
import { prisma } from '../utils/prisma';
import { IntakeData, PlanPhase } from '../types';
import { logger } from '../utils/logger';

// System prompt for plan generation
const PLAN_GENERATION_PROMPT = `You are an expert career transition advisor creating personalized career roadmaps.

Based on the user's information, create a detailed, realistic career transition plan with 3-5 phases.

Each phase should:
- Cover 1-3 months
- Have a clear theme/focus
- Include 2-4 specific milestones
- Each milestone has actionable tasks with FREE resources

IMPORTANT - Resources:
- Every task MUST include 2-4 specific, real resource links
- Prioritize FREE resources (YouTube, free courses, articles, documentation)
- Use real URLs to actual resources (Coursera, edX, YouTube, Medium, documentation sites, etc.)
- Include a mix of resource types: courses, articles, videos, books, tools
- Resources should be directly relevant and high-quality

Be realistic about timelines and consider the user's constraints.
Make the plan encouraging but achievable.

Return ONLY a valid JSON object in this exact format:
{
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "duration": "1-2 months",
      "description": "What this phase focuses on",
      "milestones": [
        {
          "id": "milestone_1_1",
          "title": "Milestone title",
          "description": "What to achieve",
          "estimatedDuration": "2 weeks",
          "tasks": [
            {
              "id": "task_1_1_1",
              "title": "Task title",
              "description": "What to do",
              "resources": [
                {
                  "type": "course",
                  "title": "Specific Resource Name",
                  "url": "https://actual-working-url.com",
                  "description": "Why this specific resource is helpful"
                },
                {
                  "type": "video",
                  "title": "Another Specific Resource",
                  "url": "https://youtube.com/...",
                  "description": "What you'll learn from this"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Resource types can be: "article", "course", "book", "video", "tool", or "other"

Example resources to consider:
- Coursera, edX, Khan Academy (free courses)
- YouTube channels (freeCodeCamp, Traversy Media, etc.)
- Documentation sites (MDN, official docs)
- Medium, Dev.to (articles)
- GitHub repositories (tools, examples)
- Free books (O'Reilly Open Books, official guides)`;

/**
 * Generate a career plan from completed intake session
 */
export async function generatePlan(sessionId: string, userId: string): Promise<{
  planId: string;
  phases: PlanPhase[];
}> {
  // Get intake session
  const session = await prisma.intakeSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new Error('Intake session not found');
  }

  if (!session.isComplete) {
    throw new Error('Intake session is not complete. Please finish the intake first.');
  }

  const intakeData = session.collectedData as IntakeData;

  // Check if plan already exists for this intake
  const existingPlan = await prisma.careerPlan.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Build context from intake data
  const userContext = `
User Profile:
- Current Role: ${intakeData.currentRole || 'Not specified'}
- Target Role: ${intakeData.targetRole || 'Not specified'}
- Timeline: ${intakeData.timeline || 'Not specified'}
- Skills: ${intakeData.skills?.join(', ') || 'Not specified'}
- Experience: ${intakeData.experience || 'Not specified'}
- Education: ${intakeData.education || 'Not specified'}
- Motivations: ${intakeData.motivations || 'Not specified'}
- Constraints:
  - Time: ${intakeData.constraints?.time || 'Not specified'}
  - Budget: ${intakeData.constraints?.budget || 'Not specified'}
  - Location: ${intakeData.constraints?.location || 'Not specified'}

Create a personalized career transition plan for this user.`;

  logger.info('Generating career plan', { userId, sessionId });

  // Generate plan using Claude
  const response = await sendMessage(
    PLAN_GENERATION_PROMPT,
    [{ role: 'user', content: userContext }],
    8000
  );

  // Parse the JSON response
  let planData: { phases: PlanPhase[] };
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    planData = JSON.parse(jsonMatch[0]);
  } catch (error) {
    logger.error('Failed to parse plan generation response', {
      error,
      response: response.substring(0, 500),
    });
    throw new Error('Failed to generate valid plan. Please try again.');
  }

  // Save plan to database
  const plan = await prisma.careerPlan.create({
    data: {
      userId,
      targetRole: intakeData.targetRole || 'Career Transition',
      currentRole: intakeData.currentRole || 'Current Position',
      timeline: intakeData.timeline || 'Flexible',
      phases: planData.phases as never,
      agentId: 'plan_generator',
    },
  });

  // Create initial progress tracking
  await prisma.progressTracking.create({
    data: {
      userId,
      planId: plan.id,
      completedTasks: [],
      currentPhase: 0,
      lastActivity: new Date(),
      streakDays: 0,
    },
  });

  logger.info('Career plan created successfully', { userId, planId: plan.id });

  return {
    planId: plan.id,
    phases: planData.phases,
  };
}

/**
 * Get user's career plan
 */
export async function getUserPlan(userId: string) {
  const plan = await prisma.careerPlan.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      progressTracking: true,
    },
  });

  if (!plan) {
    return null;
  }

  return {
    id: plan.id,
    targetRole: plan.targetRole,
    currentRole: plan.currentRole,
    timeline: plan.timeline,
    phases: plan.phases as PlanPhase[],
    createdAt: plan.createdAt,
    progress: plan.progressTracking[0] || null,
  };
}

/**
 * Regenerate a specific phase or the entire plan
 */
export async function regeneratePlan(
  planId: string,
  userId: string,
  phaseNumber?: number
): Promise<PlanPhase[]> {
  const plan = await prisma.careerPlan.findFirst({
    where: {
      id: planId,
      userId,
    },
  });

  if (!plan) {
    throw new Error('Plan not found');
  }

  const phases = plan.phases as PlanPhase[];

  if (phaseNumber !== undefined) {
    // Regenerate specific phase
    const regeneratePrompt = `Regenerate phase ${phaseNumber} of this career transition plan.

Current Plan Context:
- Target Role: ${plan.targetRole}
- Current Role: ${plan.currentRole}
- Timeline: ${plan.timeline}

Existing Phases:
${JSON.stringify(phases, null, 2)}

Create an improved version of phase ${phaseNumber} with new milestones and tasks.
Return ONLY the JSON for the single phase.`;

    const response = await sendMessage(
      PLAN_GENERATION_PROMPT,
      [{ role: 'user', content: regeneratePrompt }],
      4000
    );

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const newPhase = JSON.parse(jsonMatch[0]) as PlanPhase;

      // Replace the phase
      phases[phaseNumber - 1] = newPhase;

      // Update plan
      await prisma.careerPlan.update({
        where: { id: planId },
        data: { phases: phases as never },
      });

      return phases;
    } catch (error) {
      logger.error('Failed to regenerate phase', { error });
      throw new Error('Failed to regenerate phase');
    }
  } else {
    // Regenerate entire plan - would need intake data
    throw new Error('Full plan regeneration not yet implemented');
  }
}
