# CareerShift AI - Frontend

A beautiful, modern career transition platform that helps people switch careers using AI agents.

## Features

### 1. Interactive Intake Portal
- Conversational AI chat interface for gathering user information
- Real-time progress tracking
- Smooth animations and typing indicators
- Auto-scrolling message feed

### 2. Dynamic Career Plan Display
- Visual roadmap/timeline of career transition phases
- Expandable phase cards with milestones and tasks
- Task completion tracking with checkboxes
- Resource links (courses, articles, videos, books)
- Export to PDF functionality
- Floating chat button to access career advisors

### 3. Progress Tracking Dashboard
- Key statistics (current phase, tasks completed, streak days)
- Interactive activity charts showing completion over time
- Gamification with achievements and badges
- Recent milestones display
- Upcoming deadlines tracking
- Motivational design

### 4. AI Agent Chat
- 5 specialized AI advisor personas
- Unique styling per agent (colors, avatars)
- Separate conversation history for each agent
- Real-time chat interface
- Personality-driven interactions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn
- Backend API running on `http://localhost:3001`

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd ai-challenge
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and set:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
ai-challenge/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── intake/            # Intake chat interface
│   ├── plan/              # Career plan display
│   ├── dashboard/         # Progress dashboard
│   ├── agents/            # AI agent chat
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── ChatMessage.tsx   # Message display component
│   ├── TypingIndicator.tsx
│   ├── PhaseCard.tsx     # Career plan phase card
│   ├── AgentCard.tsx     # Agent selection card
│   ├── Navigation.tsx    # Main navigation
│   └── ProtectedRoute.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication state
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client functions
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper utilities
└── public/               # Static assets
\`\`\`

## Pages

### Landing Page (`/`)
- Hero section with value proposition
- Feature overview with 3 core features
- Call-to-action buttons
- Footer with project info

### Auth Pages (`/auth/login`, `/auth/register`)
- Clean, centered form design
- Email/password authentication
- Error handling and validation
- Links to toggle between login/register

### Intake Portal (`/intake`)
- Real-time chat with AI
- Progress bar showing completion
- Typing indicators
- Sticky input at bottom
- Auto-scroll to latest message
- "Start Over" functionality

### Career Plan (`/plan`)
- Timeline layout with phases
- Expandable accordion for milestones
- Task checkboxes with completion tracking
- Resource links with icons
- Phase progress indicators
- Floating chat button

### Dashboard (`/dashboard`)
- Welcome message with user name
- 4 key stat cards (phase, tasks, streak, achievements)
- Activity chart showing daily progress
- Upcoming deadlines
- Recent milestones
- Achievement badges
- Quick action buttons

### Agents (`/agents`)
- Grid of 5 AI advisor personas
- Click to start conversation
- Unique colors and avatars per agent
- Separate chat history per agent
- Back button to agent selection

## API Integration

The frontend connects to a backend API at `http://localhost:3001` with the following endpoints:

**Auth:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Intake:**
- `POST /api/intake/start` - Begin intake session
- `POST /api/intake/respond` - Send user response
- `GET /api/intake/session/:id` - Get session details

**Plans:**
- `POST /api/plan/generate` - Generate plan
- `GET /api/plan/:userId` - Get user's plan

**Progress:**
- `GET /api/progress/:userId` - Get progress data
- `POST /api/progress/update` - Update task
- `POST /api/progress/milestone` - Update milestone

**Agents:**
- `GET /api/agent/list` - Get all agents
- `POST /api/agent/chat` - Send message to agent

## Development

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Start Production Server

\`\`\`bash
npm start
\`\`\`

### Lint Code

\`\`\`bash
npm run lint
\`\`\`

## Design Philosophy

- **Modern SaaS Feel**: Clean like Linear or Notion
- **Conversational**: Friendly like ChatGPT
- **Motivating**: Gamification like Duolingo
- **Professional**: Appropriate for career platform
- **Purple/Blue Theme**: Matches AI Prompt Championship branding
- **Mobile-First**: Responsive design for all devices
- **Accessible**: Proper contrast, keyboard navigation

## Key Features

✅ Smooth animations and transitions
✅ Loading states for all async actions
✅ Error handling with helpful messages
✅ Optimistic UI updates
✅ Auto-scrolling chat interfaces
✅ Real-time progress tracking
✅ Gamification elements
✅ Responsive mobile design
✅ Protected routes with authentication
✅ Persistent auth with localStorage

## Built For

AI Prompt Championship - Career Transition Platform Demo

## License

MIT
