import { config } from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

// Load environment variables
config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
    },
  });

  console.log('Created users:', { user1: user1.email, user2: user2.email });

  // Create completed intake session for user1
  const intakeSession1 = await prisma.intakeSession.create({
    data: {
      userId: user1.id,
      conversationHistory: [
        {
          role: 'assistant',
          content: 'Hi! I\'m here to help you plan your career transition. What is your current role?',
          timestamp: new Date(),
        },
        {
          role: 'user',
          content: 'I\'m currently working as a Marketing Manager at a tech company.',
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: 'Great! What role or career are you looking to transition into?',
          timestamp: new Date(),
        },
        {
          role: 'user',
          content: 'I want to become a Product Manager.',
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: 'Excellent choice! What\'s your timeline for making this transition?',
          timestamp: new Date(),
        },
        {
          role: 'user',
          content: 'I\'m hoping to transition within the next 12 months.',
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: 'What skills do you currently have that you think will help in product management?',
          timestamp: new Date(),
        },
        {
          role: 'user',
          content: 'I have strong communication skills, experience with user research, and I understand the product development lifecycle from working closely with product teams.',
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: 'Thank you! I have all the information I need to create your personalized career transition plan.',
          timestamp: new Date(),
        },
      ],
      currentStep: 8,
      isComplete: true,
      collectedData: {
        currentRole: 'Marketing Manager',
        targetRole: 'Product Manager',
        timeline: '12 months',
        skills: ['Communication', 'User Research', 'Product Development Lifecycle'],
        experience: '5 years in marketing at tech companies',
        education: 'Bachelor\'s in Marketing',
        motivations: 'Want to have more impact on product decisions and strategy',
        constraints: {
          time: '10-15 hours per week',
          budget: '$2000 for courses',
          location: 'Remote or San Francisco Bay Area',
        },
      },
    },
  });

  console.log('Created intake session for user1:', intakeSession1.id);

  // Create career plan for user1
  const careerPlan1 = await prisma.careerPlan.create({
    data: {
      userId: user1.id,
      targetRole: 'Product Manager',
      currentRole: 'Marketing Manager',
      timeline: '12 months',
      agentId: 'strategic-advisor',
      phases: [
        {
          id: 'phase-1',
          title: 'Foundation Building',
          description: 'Build core product management skills and knowledge',
          duration: '3 months',
          order: 1,
          milestones: [
            {
              id: 'milestone-1-1',
              title: 'Complete Product Management Fundamentals',
              description: 'Learn the basics of product management through online courses',
              isCompleted: true,
              tasks: [
                {
                  id: 'task-1-1-1',
                  title: 'Complete "Product Management 101" on Coursera',
                  description: 'Comprehensive introduction to product management principles',
                  isCompleted: true,
                  resourceLinks: [
                    {
                      title: 'Product Management 101 - Coursera',
                      url: 'https://www.coursera.org/learn/product-management',
                      type: 'course',
                    },
                  ],
                },
                {
                  id: 'task-1-1-2',
                  title: 'Read "Inspired" by Marty Cagan',
                  description: 'Essential book on product management',
                  isCompleted: true,
                  resourceLinks: [
                    {
                      title: 'Inspired - Amazon',
                      url: 'https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507',
                      type: 'book',
                    },
                  ],
                },
              ],
            },
            {
              id: 'milestone-1-2',
              title: 'Learn Product Analytics',
              description: 'Understand how to use data to make product decisions',
              isCompleted: false,
              tasks: [
                {
                  id: 'task-1-2-1',
                  title: 'Complete Google Analytics certification',
                  description: 'Learn to analyze product metrics',
                  isCompleted: false,
                  resourceLinks: [
                    {
                      title: 'Google Analytics Academy',
                      url: 'https://analytics.google.com/analytics/academy/',
                      type: 'course',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'phase-2',
          title: 'Practical Experience',
          description: 'Gain hands-on product management experience',
          duration: '4 months',
          order: 2,
          milestones: [
            {
              id: 'milestone-2-1',
              title: 'Lead Cross-functional Project',
              description: 'Take ownership of a product initiative in current role',
              isCompleted: false,
              tasks: [
                {
                  id: 'task-2-1-1',
                  title: 'Volunteer for product launch project',
                  description: 'Work with engineering, design, and sales teams',
                  isCompleted: false,
                  resourceLinks: [],
                },
              ],
            },
          ],
        },
        {
          id: 'phase-3',
          title: 'Job Search & Transition',
          description: 'Prepare for and execute job search',
          duration: '5 months',
          order: 3,
          milestones: [
            {
              id: 'milestone-3-1',
              title: 'Build PM Portfolio',
              description: 'Create case studies and portfolio website',
              isCompleted: false,
              tasks: [
                {
                  id: 'task-3-1-1',
                  title: 'Create portfolio website',
                  description: 'Showcase PM projects and case studies',
                  isCompleted: false,
                  resourceLinks: [],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  console.log('Created career plan for user1');

  // Create progress tracking for user1
  const progress1 = await prisma.progressTracking.create({
    data: {
      userId: user1.id,
      planId: careerPlan1.id,
      currentPhase: 1,
      completedTasks: ['task-1-1-1', 'task-1-1-2'],
      streakDays: 7,
      lastActivity: new Date(),
    },
  });

  console.log('Created progress tracking for user1:', progress1.id);

  // Create an incomplete intake session for user2
  const intakeSession2 = await prisma.intakeSession.create({
    data: {
      userId: user2.id,
      conversationHistory: [
        {
          role: 'assistant',
          content: 'Hi! I\'m here to help you plan your career transition. What is your current role?',
          timestamp: new Date(),
        },
        {
          role: 'user',
          content: 'I\'m a Software Engineer working on backend systems.',
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: 'Great! What role or career are you looking to transition into?',
          timestamp: new Date(),
        },
        {
          role: 'user',
          content: 'I want to move into a DevOps/Site Reliability Engineer role.',
          timestamp: new Date(),
        },
      ],
      currentStep: 2,
      isComplete: false,
      collectedData: {
        currentRole: 'Software Engineer',
        targetRole: 'DevOps/SRE',
      },
    },
  });

  console.log('Created incomplete intake session for user2:', intakeSession2.id);

  // Create some agent interactions
  await prisma.agentInteraction.create({
    data: {
      userId: user1.id,
      agentId: 'skill-builder',
      message: 'What technical skills should I focus on to become a Product Manager?',
      response: 'For transitioning to Product Management, I recommend focusing on: 1) SQL and basic data analysis, 2) Understanding of software development lifecycle, 3) Wireframing and prototyping tools like Figma, 4) Product analytics tools like Mixpanel or Amplitude. Your marketing background gives you a head start on user research and communication!',
      context: {
        userRole: 'Marketing Manager',
        targetRole: 'Product Manager',
      },
    },
  });

  console.log('Created agent interactions');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
