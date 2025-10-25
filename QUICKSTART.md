# Quick Start Guide

Get the Career Transition AI Platform running in 5 minutes!

## 1. Prerequisites Check

```bash
node --version    # Should be 18+
docker --version  # Should be installed
```

## 2. Install

```bash
npm install
```

## 3. Configure

Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/career_transition?schema=public
ANTHROPIC_API_KEY=your_key_here
JWT_SECRET=your_secret_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 4. Start Database

```bash
npm run docker:up
```

## 5. Setup Database

```bash
npm run db:setup
```

## 6. Run Application

```bash
npm run dev
```

## 7. Access

Open http://localhost:3000

Login with:
- Email: `john.doe@example.com`
- Password: `password123`

## That's it! 🎉

For detailed setup, see [SETUP.md](./SETUP.md)
