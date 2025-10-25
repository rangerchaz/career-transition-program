# Setup Guide - Career Transition AI Platform Backend

This guide will walk you through setting up the backend from scratch.

## Step 1: Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **PostgreSQL** (version 13 or higher)
   - Install PostgreSQL on your system
   - Make sure it's running:
     ```bash
     # On macOS with Homebrew
     brew services start postgresql

     # On Linux
     sudo systemctl start postgresql

     # On Windows
     # Start PostgreSQL from Services or pg_ctl
     ```

3. **Anthropic API Key**
   - Sign up at https://console.anthropic.com
   - Create an API key
   - Keep it handy for Step 3

## Step 2: Install Dependencies

All dependencies are already listed in `package.json`. Install them:

```bash
npm install
```

This installs:
- Production dependencies (Express, Prisma, Anthropic SDK, etc.)
- Development dependencies (TypeScript, ts-node-dev, etc.)

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your actual values:

```env
# Database Connection
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/career_transition?schema=public

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**How to configure each:**

### DATABASE_URL
Replace with your PostgreSQL credentials:
- `USERNAME`: Your PostgreSQL username (default is often `postgres`)
- `PASSWORD`: Your PostgreSQL password
- `localhost:5432`: Your PostgreSQL host and port
- `career_transition`: Database name (will be created in next step)

Example:
```
postgresql://postgres:mypassword@localhost:5432/career_transition?schema=public
```

### ANTHROPIC_API_KEY
Your Anthropic API key from https://console.anthropic.com

### JWT_SECRET
Generate a secure random string (at least 32 characters):
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use any random string generator
```

## Step 4: Create the Database

1. Connect to PostgreSQL:
```bash
psql -U postgres
```

2. Create the database:
```sql
CREATE DATABASE career_transition;
```

3. Exit psql:
```sql
\q
```

Or using a single command:
```bash
createdb -U postgres career_transition
```

## Step 5: Run Database Migrations

Generate Prisma Client and create tables:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate
```

You'll be prompted to name the migration. You can use something like "init" or "initial_schema".

## Step 6: Verify Database Setup

Open Prisma Studio to see your database:
```bash
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 where you can see all your tables:
- users
- intake_sessions
- career_plans
- progress_tracking
- agent_interactions

## Step 7: Start the Development Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   Career Transition AI Platform - Backend API         ║
║                                                        ║
║   Server running on: http://localhost:3001            ║
║   Environment: development                            ║
║                                                        ║
║   Health check: http://localhost:3001/health          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

## Step 8: Test the API

### Test Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "testpassword123"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

Save the token for next requests!

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### Test Protected Endpoint
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 9: Test Full Flow

1. **Register** a user (see above)
2. **Login** and get token
3. **Start intake**:
```bash
curl -X POST http://localhost:3001/api/intake/start \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

4. **Send intake messages**:
```bash
curl -X POST http://localhost:3001/api/intake/SESSION_ID/message \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"message": "I am a software engineer"}'
```

5. **Generate plan** (after completing intake):
```bash
curl -X POST http://localhost:3001/api/plans/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "SESSION_ID"}'
```

6. **Chat with an agent**:
```bash
curl -X POST http://localhost:3001/api/agents/alex/chat \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"message": "I need motivation!"}'
```

## Troubleshooting

### Error: "Missing required environment variable"
- Check that all required variables in `.env` are set
- Ensure no typos in variable names
- Make sure `.env` file exists in project root

### Error: "Can't reach database server"
- Verify PostgreSQL is running
- Check DATABASE_URL credentials
- Try connecting with psql manually

### Error: "Invalid API key"
- Verify ANTHROPIC_API_KEY is correct
- Check you have credits/access in Anthropic console
- Ensure no extra spaces in the key

### Error: "Port 3001 already in use"
- Change PORT in `.env` to a different port (e.g., 3002)
- Or kill the process using port 3001

### TypeScript errors
- Run `npm run prisma:generate` to regenerate Prisma Client
- Delete `node_modules` and `package-lock.json`, then `npm install` again

### Migration errors
- Delete the database and recreate it
- Remove `prisma/migrations` folder
- Run `npm run prisma:migrate` again

## Using Postman or Insomnia

1. Import the endpoints from `API_DOCUMENTATION.md`
2. Set up environment variables for:
   - `base_url`: http://localhost:3001
   - `token`: (set after login/register)
3. Use `{{base_url}}` and `{{token}}` in your requests

## Development Workflow

1. Make changes to code
2. Server auto-restarts (thanks to ts-node-dev)
3. Test endpoint with curl/Postman
4. Check logs in terminal
5. Use Prisma Studio to inspect database

## Production Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Set up production PostgreSQL database
- [ ] Configure FRONTEND_URL to production domain
- [ ] Set up environment variables on hosting platform
- [ ] Run `npm run build`
- [ ] Run migrations on production DB
- [ ] Set up logging/monitoring
- [ ] Configure HTTPS/SSL
- [ ] Set up rate limiting
- [ ] Configure CORS for production domain

## Next Steps

- Read `API_DOCUMENTATION.md` for complete API reference
- Check `README.md` for project overview
- Start building your frontend!
- Test all agent personas
- Customize the AI prompts in `services/` folder

## Need Help?

Check:
1. Server logs in terminal
2. Prisma Studio for database state
3. API_DOCUMENTATION.md for endpoint details
4. README.md for architecture overview
