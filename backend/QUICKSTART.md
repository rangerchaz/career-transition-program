# Quick Start - 5 Minutes to Running Server

The absolute fastest way to get the backend running.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL running
- Anthropic API key

## 5 Steps

### 1. Install Dependencies (30 seconds)
```bash
npm install
```

### 2. Configure Environment (1 minute)
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/career_transition?schema=public
ANTHROPIC_API_KEY=sk-ant-your-key-here
JWT_SECRET=any-random-string-min-32-chars-long
```

### 3. Create Database (10 seconds)
```bash
createdb career_transition
# or: psql -U postgres -c "CREATE DATABASE career_transition;"
```

### 4. Run Migrations (30 seconds)
```bash
npm run prisma:generate
npm run prisma:migrate
```

When prompted, name the migration "init" or press Enter.

### 5. Start Server (immediate)
```bash
npm run dev
```

Done! Server running at http://localhost:3001

## Verify It Works

```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"healthy","timestamp":"...","environment":"development"}
```

## Next Steps

1. Read `API_DOCUMENTATION.md` for all endpoints
2. Test with the example flow below
3. Connect your frontend

## Example Test Flow

### 1. Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

Save the token from response!

### 2. Start Intake
```bash
curl -X POST http://localhost:3001/api/intake/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Save the sessionId!

### 3. Answer Questions
```bash
curl -X POST http://localhost:3001/api/intake/SESSION_ID/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I am a software engineer"}'
```

Continue answering 7-10 questions until `isComplete: true`

### 4. Generate Plan
```bash
curl -X POST http://localhost:3001/api/plans/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"SESSION_ID"}'
```

### 5. Chat with Agent
```bash
curl -X POST http://localhost:3001/api/agents/alex/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I need motivation to keep going!"}'
```

## Common Issues

**"Cannot connect to database"**
→ Make sure PostgreSQL is running: `brew services start postgresql` (macOS)

**"Invalid API key"**
→ Double-check your Anthropic API key in `.env`

**"Port 3001 in use"**
→ Change PORT in `.env` to 3002 or kill process on 3001

## That's It!

Your backend is ready for frontend integration or testing with Postman/Insomnia.

See full documentation:
- `README.md` - Complete overview
- `API_DOCUMENTATION.md` - All endpoints
- `SETUP_GUIDE.md` - Detailed setup instructions
