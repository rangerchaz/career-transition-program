# Setup Guide

Complete setup instructions for the Career Transition AI Platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd career-transition-platform
```

### 2. Install Dependencies

Install all dependencies for both frontend and backend:

```bash
npm install
```

This will automatically install dependencies in both `backend/` and `frontend/` directories.

### 3. Set Up Environment Variables

#### Backend Environment Variables

Create `backend/.env`:

```bash
cd backend
cp .env.example .env  # If you have an example file
# OR create it manually:
cat > .env << 'EOF'
DATABASE_URL=postgresql://user:password@localhost:5432/career_transition?schema=public
ANTHROPIC_API_KEY=your_anthropic_api_key_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
```

**Important**: Replace `your_anthropic_api_key_here` with your actual Anthropic API key.

#### Frontend Environment Variables

Create `frontend/.env.local`:

```bash
cd ../frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
cd ..
```

### 4. Start PostgreSQL Database

From the root directory:

```bash
npm run docker:up
```

This will start PostgreSQL in a Docker container. Verify it's running:

```bash
docker ps
```

You should see `career-transition-postgres` running.

### 5. Set Up the Database

Run migrations and seed data:

```bash
npm run db:setup
```

This will:
- Create all database tables
- Seed the database with sample users and data

### 6. Start the Application

From the root directory:

```bash
npm run dev
```

This will start both servers:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

You should see output like:
```
[0] Server started on port 3001
[1] ▲ Next.js 14.2.5
[1] - Local:        http://localhost:3000
```

### 7. Access the Application

Open your browser and navigate to:

**http://localhost:3000**

## Test Accounts

After seeding, you can log in with:

### John Doe (Complete Journey)
- Email: `john.doe@example.com`
- Password: `password123`
- Has: Complete career plan, progress tracking, achievements

### Jane Smith (In Progress)
- Email: `jane.smith@example.com`
- Password: `password123`
- Has: Incomplete intake session

## Verify Everything is Working

### 1. Backend Health Check

```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "environment": "development"
}
```

### 2. Frontend

- Visit http://localhost:3000
- You should see the homepage
- Try logging in with test accounts

### 3. Database

Open Prisma Studio to view database:

```bash
npm run db:studio
```

Opens at http://localhost:5555

## Common Issues & Solutions

### Issue: "Cannot connect to database"

**Solution**:
```bash
# Check if Docker is running
docker ps

# Restart PostgreSQL
npm run docker:reset

# Wait a few seconds, then retry migrations
npm run db:migrate
```

### Issue: "ANTHROPIC_API_KEY not found"

**Solution**:
- Ensure you created `backend/.env` file
- Add your Anthropic API key
- Restart the backend server

### Issue: "Port 3001 already in use"

**Solution**:
```bash
# Find and kill the process
# On Mac/Linux:
lsof -ti:3001 | xargs kill -9

# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Issue: Frontend can't connect to backend

**Solution**:
- Verify backend is running on port 3001
- Check `frontend/.env.local` has correct API URL
- Check CORS settings in `backend/src/index.ts`

### Issue: "Prisma Client is not generated"

**Solution**:
```bash
cd backend
npx prisma generate
cd ..
```

## Development Workflow

### Running Individual Services

**Backend only**:
```bash
npm run dev:backend
```

**Frontend only**:
```bash
npm run dev:frontend
```

### Database Operations

**Run migrations**:
```bash
npm run db:migrate
```

**Seed database**:
```bash
npm run db:seed
```

**Open Prisma Studio**:
```bash
npm run db:studio
```

**Reset database** (deletes all data):
```bash
npm run docker:reset
npm run db:setup
```

### Stopping Services

**Stop development servers**:
- Press `Ctrl+C` in the terminal running `npm run dev`

**Stop Docker**:
```bash
npm run docker:down
```

**Stop Docker and delete data**:
```bash
docker-compose down -v
```

## Next Steps

1. **Explore the Platform**:
   - Log in with test accounts
   - Complete intake process
   - View career plans
   - Chat with AI advisors

2. **Customize**:
   - Update AI prompts in `backend/src/services/`
   - Modify UI components in `frontend/components/`
   - Add new features

3. **Deploy**:
   - See deployment section in README.md
   - Set up production database
   - Configure environment variables for production

## Getting Help

- Check the main [README.md](./README.md) for detailed documentation
- Review the [API documentation](./SEED_DATA.md) for sample data structure
- Check backend logs for errors
- Use Prisma Studio to inspect database

## Useful Commands Summary

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start both frontend and backend |
| `npm run docker:up` | Start PostgreSQL |
| `npm run docker:down` | Stop PostgreSQL |
| `npm run db:setup` | Migrate and seed database |
| `npm run db:studio` | Open database GUI |
| `npm run build` | Build for production |

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/career_transition` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | `sk-ant-api03-...` |
| `JWT_SECRET` | Secret for JWT tokens | Random string |
| `PORT` | Backend port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

---

You're all set! 🎉 Start building your career transition platform.
