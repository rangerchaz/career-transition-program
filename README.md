# Career Transition AI Platform

A full-stack AI-powered career transition platform that helps users plan and execute their career transitions with personalized guidance, progress tracking, and AI advisors.

## Features

- **AI-Powered Intake**: Conversational onboarding to understand career goals
- **Personalized Career Plans**: AI-generated roadmaps with phases, milestones, and tasks
- **Progress Tracking**: Dashboard with streaks, achievements, and activity charts
- **5 AI Advisors**: Specialized agents for different aspects of career transition
  - **Alex** 💪 - Career Coach (motivation & goal-setting)
  - **Jordan** 📚 - Skills Advisor (technical guidance)
  - **Morgan** 🌐 - Industry Insider (market insights)
  - **Casey** ⏰ - Accountability Partner (progress tracking)
  - **Sam** 🧘 - Mentor (big-picture guidance)
- **Free Resources**: AI-curated learning resources for each task

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Recharts** - Data visualization

### Backend
- **Node.js** + **Express** - REST API
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Anthropic Claude** - AI/LLM integration
- **JWT** - Authentication

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- Anthropic API key

## Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd career-transition-platform
```

### 2. Install dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend.

### 3. Set up environment variables

Create `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/career_transition?schema=public
ANTHROPIC_API_KEY=your_anthropic_api_key_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Create `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Start PostgreSQL database

```bash
docker-compose up -d
```

### 5. Set up the database

```bash
cd backend
npm run prisma:migrate
npm run seed
cd ..
```

### 6. Start development servers

From the root directory:

```bash
npm run dev
```

This will start:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

## Demo Accounts

After seeding, you can log in with these accounts:

### John Doe (Complete Journey)
- **Email**: `john.doe@example.com`
- **Password**: `password123`
- **Features**: Complete career plan, progress tracking, agent interactions

### Jane Smith (In Progress)
- **Email**: `jane.smith@example.com`
- **Password**: `password123`
- **Features**: Incomplete intake session

## Project Structure

```
career-transition-platform/
├── backend/                 # Express + Prisma backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── scripts/
│       └── seed.ts         # Database seeding
│
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── intake/        # Intake process
│   │   ├── plan/          # Career plan view
│   │   └── agents/        # AI advisors
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   └── lib/              # Utilities & API client
│
├── docker-compose.yml     # PostgreSQL setup
└── package.json          # Root package.json
```

## Available Scripts

### Root Level

- `npm install` - Install all dependencies (frontend + backend)
- `npm run dev` - Start both servers concurrently
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run build` - Build both applications

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run seed` - Seed database with sample data

### Frontend

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Intake
- `POST /api/intake/start` - Start intake session
- `POST /api/intake/:sessionId/message` - Send message
- `GET /api/intake/session/:sessionId` - Get session

### Plans
- `POST /api/plans/generate` - Generate career plan
- `GET /api/plans` - Get user's plan

### Progress
- `GET /api/progress` - Get progress data
- `PUT /api/progress/task` - Update task completion
- `POST /api/progress/milestone/:id/complete` - Complete milestone

### Agents
- `GET /api/agents` - List all AI advisors
- `GET /api/agents/:agentId` - Get agent details
- `POST /api/agents/:agentId/chat` - Chat with agent
- `GET /api/agents/:agentId/conversation` - Get conversation history

## Database Schema

See `backend/prisma/schema.prisma` for the complete schema.

Main models:
- **User** - User accounts
- **IntakeSession** - Onboarding conversations
- **CareerPlan** - Generated career roadmaps
- **ProgressTracking** - User progress & streaks
- **AgentInteraction** - AI advisor chat history

## AI Integration

The platform uses Anthropic's Claude API for:
- **Intake conversations** - Natural language onboarding
- **Plan generation** - Personalized career roadmaps with resources
- **AI advisors** - 5 specialized agents with unique personalities

## Development

### Adding a new API endpoint

1. Create route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add service logic in `backend/src/services/`
4. Update types in `backend/src/types/`
5. Add frontend API call in `frontend/lib/api.ts`

### Adding a new page

1. Create page in `frontend/app/`
2. Add components in `frontend/components/`
3. Update types in `frontend/lib/types.ts`

## Deployment

### Backend
- Build: `npm run build`
- Set environment variables
- Run migrations: `npm run prisma:migrate`
- Start: `npm start`

### Frontend
- Build: `npm run build`
- Set environment variables
- Start: `npm start`

### Database
- Use managed PostgreSQL (AWS RDS, Heroku Postgres, etc.)
- Update `DATABASE_URL` in environment

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker-compose ps`
- Verify DATABASE_URL in `.env`
- Run migrations: `npm run prisma:migrate`

### Frontend errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Database issues
- Reset database: `docker-compose down -v && docker-compose up -d`
- Re-run migrations and seed

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
