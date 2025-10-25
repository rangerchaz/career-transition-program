# Career Transition AI Platform - Backend

A comprehensive REST API backend for a career transition platform that helps people switch careers using AI agents powered by Claude (Sonnet 4.5).

## Features

### 1. Interactive Intake Portal
- Conversational AI-driven intake process (feels natural, not like a form)
- Gathers user information through 7-10 contextual questions
- Extracts structured data automatically

### 2. Dynamic Plan Generation
- Creates personalized career roadmaps with 3-5 phases
- Each phase includes milestones and actionable tasks
- Considers user constraints (time, budget, location)
- Uses Claude AI to generate realistic, achievable plans

### 3. Progress Tracking Dashboard
- Track task and milestone completion
- Calculate streak days for daily activity
- Automatic phase progression
- Detailed progress analytics

### 4. AI Agent Personas
Five distinct AI assistants with unique personalities:
- **Alex (Career Coach)**: Enthusiastic, motivational
- **Jordan (Skills Advisor)**: Analytical, practical
- **Morgan (Industry Insider)**: Connected, market-focused
- **Casey (Accountability Partner)**: Firm but kind
- **Sam (Mentor)**: Wise, big-picture guidance

## Tech Stack

- **Runtime:** Node.js with TypeScript (strict mode)
- **Framework:** Express
- **Database:** PostgreSQL with Prisma ORM
- **AI:** Anthropic Claude API (Sonnet 4.5)
- **Auth:** JWT with bcrypt password hashing
- **CORS:** Enabled for frontend (port 3000)

## Project Structure

```
src/
├── controllers/       # Request handlers
├── routes/           # API route definitions
├── services/         # Business logic & AI integration
├── middleware/       # Auth, validation, error handling
├── utils/            # Config, logger, Prisma client
├── types/            # TypeScript type definitions
└── index.ts          # Express app & server setup

prisma/
└── schema.prisma     # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Anthropic API key

### Installation

1. Clone the repository
```bash
cd ai-challenge
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/career_transition?schema=public
ANTHROPIC_API_KEY=your_anthropic_api_key_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Set up the database
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. Start development server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Overview

- **Auth**: `/api/auth/*` - Registration, login, user info
- **Intake**: `/api/intake/*` - Conversational intake session
- **Plans**: `/api/plans/*` - Career plan generation & retrieval
- **Agents**: `/api/agents/*` - Chat with AI personas
- **Progress**: `/api/progress/*` - Track completion & streaks

## Database Schema

### Users
- Authentication and profile information

### IntakeSession
- Conversation history
- Collected user data (JSON)
- Completion status

### CareerPlan
- Target/current roles
- Phases with milestones and tasks (JSON)
- Timeline

### ProgressTracking
- Completed tasks tracking
- Current phase
- Streak calculation
- One-to-one with CareerPlan

### AgentInteraction
- Conversation history with each agent
- Context preservation

## Key Implementation Details

### Conversational Intake
- Uses Claude to generate contextual follow-up questions
- Automatically detects completion (7-10 questions)
- Extracts structured data from natural conversation
- Maintains full conversation history

### Plan Generation
- Sends intake data to Claude with structured prompt
- Parses JSON response into database schema
- Creates initial progress tracking automatically
- Can regenerate specific phases

### Agent System
- Each agent has unique system prompt defining personality
- Maintains separate conversation threads per agent
- Includes user's career plan as context
- Stores last 5 interactions for continuity

### Progress Tracking
- Calculates streaks based on daily activity
- Auto-advances phases when 80% complete
- Tracks completion at task, milestone, and phase levels

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)

## Error Handling

- Centralized error handling middleware
- Custom `AppError` class for operational errors
- Proper HTTP status codes
- Async error handling with `asyncHandler` wrapper
- Development vs. production error responses

## Logging

- Structured JSON logging
- Different log levels (ERROR, WARN, INFO, DEBUG)
- Request logging for all API calls
- Debug logs only in development

## Security

- JWT token authentication (7-day expiration)
- Password hashing with bcrypt (10 rounds)
- Input validation on all endpoints
- CORS configured for frontend only
- SQL injection protection via Prisma

## Graceful Shutdown

- Handles SIGTERM and SIGINT signals
- Closes HTTP server gracefully
- Disconnects Prisma client
- 10-second timeout for forced shutdown

## Testing with Postman/Insomnia

1. Register a user: `POST /api/auth/register`
2. Use returned token in Authorization header
3. Start intake: `POST /api/intake/start`
4. Send messages: `POST /api/intake/:sessionId/message`
5. Generate plan: `POST /api/plans/generate`
6. Chat with agents: `POST /api/agents/:agentId/chat`
7. Update progress: `PUT /api/progress/task`

## Frontend Integration

The API is designed to work with a frontend running on port 3000. CORS is configured to allow requests from `http://localhost:3000`.

Example frontend fetch:
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

const { token, user } = await response.json();

// Use token in subsequent requests
fetch('http://localhost:3001/api/intake/start', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| ANTHROPIC_API_KEY | Anthropic API key for Claude | Yes |
| JWT_SECRET | Secret for JWT signing | Yes |
| PORT | Server port (default: 3001) | No |
| NODE_ENV | Environment (development/production) | No |
| FRONTEND_URL | Frontend URL for CORS | No |

## Known Limitations

- Single user session per intake (can resume existing)
- Plan regeneration requires complete intake
- Agent conversations limited to last 5 interactions for context
- Streak calculation is basic (consecutive days)
- No email verification on registration

## Future Enhancements

- Email notifications for milestones
- Calendar integration for deadlines
- File uploads for resume/portfolio
- Social features (share plans, connect with others)
- Advanced analytics and insights
- Rate limiting for API endpoints
- Webhook support for integrations

## Troubleshooting

### Database connection errors
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Run `npm run prisma:migrate`

### Anthropic API errors
- Verify ANTHROPIC_API_KEY is valid
- Check API usage limits
- Ensure internet connectivity

### TypeScript compilation errors
- Run `npm run prisma:generate` after schema changes
- Check tsconfig.json settings
- Ensure all dependencies are installed

## License

ISC

## Support

For issues or questions, please check:
1. API_DOCUMENTATION.md for endpoint details
2. Console logs for detailed error messages
3. Prisma Studio for database inspection

---

Built with Claude Sonnet 4.5
