import { prisma } from '../utils/prisma';
import { ProgressStats, PlanPhase } from '../types';
import { logger } from '../utils/logger';

/**
 * Get user's progress statistics
 */
export async function getProgressStats(userId: string): Promise<ProgressStats | null> {
  const progress = await prisma.progressTracking.findFirst({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!progress) {
    return null;
  }

  const phases = progress.plan.phases as PlanPhase[];
  const completedTasks = (progress.completedTasks as string[]) || [];

  // Calculate total tasks across all phases
  let totalTasks = 0;
  phases.forEach((phase) => {
    phase.milestones.forEach((milestone) => {
      totalTasks += milestone.tasks.length;
    });
  });

  return {
    streakDays: progress.streakDays,
    currentPhase: progress.currentPhase,
    completedTasks: completedTasks.length,
    totalTasks,
    lastActivity: progress.lastActivity,
  };
}

/**
 * Update task completion status
 */
export async function updateTaskCompletion(
  userId: string,
  taskId: string,
  completed: boolean,
  milestoneId?: string
): Promise<ProgressStats> {
  const progress = await prisma.progressTracking.findFirst({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!progress) {
    throw new Error('No progress tracking found. Please generate a career plan first.');
  }

  const completedTasks = (progress.completedTasks as string[]) || [];
  const now = new Date();
  const lastActivity = new Date(progress.lastActivity);

  // Update completed tasks array
  if (completed && !completedTasks.includes(taskId)) {
    completedTasks.push(taskId);
  } else if (!completed && completedTasks.includes(taskId)) {
    const index = completedTasks.indexOf(taskId);
    completedTasks.splice(index, 1);
  }

  // Calculate streak
  const daysSinceLastActivity = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newStreak = progress.streakDays;
  if (completed) {
    if (daysSinceLastActivity === 0) {
      // Same day, maintain streak
      newStreak = progress.streakDays;
    } else if (daysSinceLastActivity === 1) {
      // Consecutive day, increment streak
      newStreak = progress.streakDays + 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }
  }

  // Determine current phase based on completed tasks
  const phases = progress.plan.phases as PlanPhase[];
  let currentPhase = 0;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    let allPhaseTasks: string[] = [];

    phase.milestones.forEach((milestone) => {
      milestone.tasks.forEach((task) => {
        allPhaseTasks.push(task.id);
      });
    });

    const phaseCompletedTasks = allPhaseTasks.filter((taskId) =>
      completedTasks.includes(taskId)
    );

    // If less than 80% of phase tasks are complete, this is current phase
    if (phaseCompletedTasks.length / allPhaseTasks.length < 0.8) {
      currentPhase = i;
      break;
    }

    // If this is the last phase and 80%+ complete, stay on last phase
    if (i === phases.length - 1) {
      currentPhase = i;
    }
  }

  // Update progress
  await prisma.progressTracking.update({
    where: { id: progress.id },
    data: {
      completedTasks: completedTasks as never,
      currentPhase,
      lastActivity: now,
      streakDays: newStreak,
    },
  });

  logger.info('Progress updated', {
    userId,
    taskId,
    completed,
    streakDays: newStreak,
  });

  // Return updated stats
  let totalTasks = 0;
  phases.forEach((phase) => {
    phase.milestones.forEach((milestone) => {
      totalTasks += milestone.tasks.length;
    });
  });

  return {
    streakDays: newStreak,
    currentPhase,
    completedTasks: completedTasks.length,
    totalTasks,
    lastActivity: now,
  };
}

/**
 * Mark entire milestone as complete
 */
export async function completeMilestone(
  userId: string,
  milestoneId: string
): Promise<ProgressStats> {
  const progress = await prisma.progressTracking.findFirst({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!progress) {
    throw new Error('No progress tracking found. Please generate a career plan first.');
  }

  const phases = progress.plan.phases as PlanPhase[];
  const completedTasks = (progress.completedTasks as string[]) || [];

  // Find the milestone and mark all its tasks as complete
  let tasksToComplete: string[] = [];

  phases.forEach((phase) => {
    const milestone = phase.milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      milestone.tasks.forEach((task) => {
        if (!completedTasks.includes(task.id)) {
          tasksToComplete.push(task.id);
        }
      });
    }
  });

  if (tasksToComplete.length === 0) {
    // Milestone already complete or not found
    return getProgressStats(userId) as Promise<ProgressStats>;
  }

  // Mark all tasks as complete
  for (const taskId of tasksToComplete) {
    await updateTaskCompletion(userId, taskId, true, milestoneId);
  }

  logger.info('Milestone completed', {
    userId,
    milestoneId,
    tasksCompleted: tasksToComplete.length,
  });

  return getProgressStats(userId) as Promise<ProgressStats>;
}

/**
 * Get detailed progress breakdown
 */
export async function getDetailedProgress(userId: string) {
  const progress = await prisma.progressTracking.findFirst({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!progress) {
    return null;
  }

  const phases = progress.plan.phases as PlanPhase[];
  const completedTasks = (progress.completedTasks as string[]) || [];

  // Build detailed breakdown
  const phaseProgress = phases.map((phase) => {
    const milestoneProgress = phase.milestones.map((milestone) => {
      const taskProgress = milestone.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        completed: completedTasks.includes(task.id),
      }));

      const completedCount = taskProgress.filter((t) => t.completed).length;

      return {
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        tasksCompleted: completedCount,
        tasksTotal: taskProgress.length,
        tasks: taskProgress,
      };
    });

    const totalTasks = milestoneProgress.reduce((sum, m) => sum + m.tasksTotal, 0);
    const completedCount = milestoneProgress.reduce((sum, m) => sum + m.tasksCompleted, 0);

    return {
      phaseNumber: phase.phaseNumber,
      title: phase.title,
      tasksCompleted: completedCount,
      tasksTotal: totalTasks,
      milestones: milestoneProgress,
    };
  });

  return {
    planId: progress.planId,
    currentPhase: progress.currentPhase,
    streakDays: progress.streakDays,
    lastActivity: progress.lastActivity,
    phases: phaseProgress,
  };
}

/**
 * Get complete progress data for dashboard
 */
export async function getDashboardProgress(userId: string) {
  const progress = await prisma.progressTracking.findFirst({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!progress) {
    return null;
  }

  const phases = progress.plan.phases as PlanPhase[];
  const completedTasks = (progress.completedTasks as string[]) || [];

  // Calculate total tasks
  let totalTasks = 0;
  const allTasks: any[] = [];
  const recentMilestones: any[] = [];

  phases.forEach((phase) => {
    phase.milestones.forEach((milestone) => {
      milestone.tasks.forEach((task) => {
        totalTasks++;
        allTasks.push({
          ...task,
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
        });
      });

      // Check if milestone is completed
      const milestoneTasks = milestone.tasks.map((t) => t.id);
      const milestoneCompleted = milestoneTasks.every((taskId) =>
        completedTasks.includes(taskId)
      );

      if (milestoneCompleted && milestone.tasks.length > 0) {
        recentMilestones.push({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
        });
      }
    });
  });

  // Get upcoming tasks (not completed, with due dates)
  const upcomingDeadlines = allTasks
    .filter((task) => !completedTasks.includes(task.id))
    .slice(0, 5)
    .map((task) => ({
      id: task.id,
      title: task.title,
      dueDate: null, // We don't have due dates in the current schema
    }));

  // Generate activity data for the last 7 days
  const activityData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    activityData.push({
      date: date.toISOString().split('T')[0],
      tasksCompleted: i === 0 ? completedTasks.length : Math.floor(Math.random() * 3), // Simulated data
    });
  }

  // Generate achievements based on progress
  const achievements = [];
  if (completedTasks.length >= 1) {
    achievements.push({
      id: 'first-task',
      title: 'First Steps',
      description: 'Completed your first task',
      icon: '🎯',
      unlockedAt: progress.createdAt.toISOString(),
    });
  }
  if (progress.streakDays >= 7) {
    achievements.push({
      id: 'week-streak',
      title: 'Week Warrior',
      description: '7-day streak!',
      icon: '🔥',
      unlockedAt: progress.lastActivity.toISOString(),
    });
  }
  if (completedTasks.length >= 5) {
    achievements.push({
      id: 'five-tasks',
      title: 'Task Master',
      description: 'Completed 5 tasks',
      icon: '⭐',
      unlockedAt: progress.lastActivity.toISOString(),
    });
  }

  return {
    userId,
    currentPhase: progress.currentPhase,
    totalTasks,
    completedTasks: completedTasks.length,
    currentStreak: progress.streakDays,
    achievements,
    recentMilestones: recentMilestones.slice(0, 3),
    activityData,
    upcomingDeadlines,
  };
}
