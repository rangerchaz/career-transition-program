# Sample Data Documentation

## Seed Accounts

The database has been populated with sample data. Use these accounts to explore the application:

### 1. John Doe (Complete Career Transition)
- **Email**: `john.doe@example.com`
- **Password**: `password123`
- **Status**: Complete
- **Features to explore**:
  - ✅ Completed intake session (8 messages)
  - ✅ Full career plan (Marketing Manager → Product Manager)
  - ✅ 3 phases with milestones and tasks
  - ✅ Progress tracking with 2 completed tasks
  - ✅ 7-day activity streak
  - ✅ Agent interaction history

### 2. Jane Smith (Incomplete Intake)
- **Email**: `jane.smith@example.com`
- **Password**: `password123`
- **Status**: In progress
- **Features to explore**:
  - ✅ Partial intake session (4 messages)
  - ⏸️ Can continue the intake process
  - Career: Software Engineer → DevOps/SRE

## John Doe's Career Plan Structure

### Phase 1: Foundation Building (3 months)
- **Milestone 1**: Complete Product Management Fundamentals ✅
  - Task: Complete "Product Management 101" on Coursera ✅
  - Task: Read "Inspired" by Marty Cagan ✅

- **Milestone 2**: Learn Product Analytics
  - Task: Complete Google Analytics certification

### Phase 2: Practical Experience (4 months)
- **Milestone**: Lead Cross-functional Project
  - Task: Volunteer for product launch project

### Phase 3: Job Search & Transition (5 months)
- **Milestone**: Build PM Portfolio
  - Task: Create portfolio website

## How to Access Seed Data

1. **Logout** of your current account (if logged in)
2. Go to the login page
3. Use one of the credentials above
4. Explore the dashboard, career plan, and progress pages

## Viewing All Data

You can also view all database data using Prisma Studio:
```bash
cd backend
npm run prisma:studio
```
Then open http://localhost:5555 in your browser.

## Resetting Seed Data

To reset and re-seed the database:
```bash
cd backend
npm run seed
```

Note: This will not delete existing data, it will add duplicate entries if run multiple times.
