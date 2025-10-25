# Career Transition AI Platform - API Documentation

Base URL: `http://localhost:3001`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Get Current User
**GET** `/api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Intake Endpoints

### Start Intake Session
**POST** `/api/intake/start`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "sessionId": "session_id",
  "question": "Hi! I'm excited to help you plan your career transition. Let's start with where you are now - what's your current role?",
  "currentStep": 1,
  "isComplete": false
}
```

---

### Send Intake Message
**POST** `/api/intake/:sessionId/message`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I'm currently a software engineer"
}
```

**Response:** `200 OK`
```json
{
  "question": "Great! And what role or career are you looking to transition into?",
  "isComplete": false,
  "currentStep": 2
}
```

---

### Get Intake Session
**GET** `/api/intake/:sessionId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "session_id",
  "conversationHistory": [...],
  "currentStep": 5,
  "isComplete": true,
  "collectedData": {
    "currentRole": "Software Engineer",
    "targetRole": "Product Manager",
    "timeline": "6 months",
    "skills": ["Python", "JavaScript"],
    "experience": "5 years in software development",
    "education": "BS Computer Science",
    "motivations": "Want more user interaction",
    "constraints": {
      "time": "Evenings and weekends",
      "budget": "$500",
      "location": "Remote preferred"
    }
  }
}
```

---

## Plan Endpoints

### Generate Career Plan
**POST** `/api/plans/generate`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "completed_intake_session_id"
}
```

**Response:** `201 Created`
```json
{
  "planId": "plan_id",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Foundation & Skills Assessment",
      "duration": "1-2 months",
      "description": "Build foundational product management knowledge",
      "milestones": [
        {
          "id": "milestone_1_1",
          "title": "Complete PM fundamentals course",
          "description": "Learn core PM concepts",
          "estimatedDuration": "2 weeks",
          "tasks": [
            {
              "id": "task_1_1_1",
              "title": "Enroll in PM course",
              "description": "Sign up for a product management course",
              "resources": [
                {
                  "type": "course",
                  "title": "Product Management Fundamentals",
                  "url": "https://example.com/course",
                  "description": "Comprehensive PM course"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "message": "Career plan generated successfully"
}
```

---

### Get User's Plan
**GET** `/api/plans`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "plan_id",
  "targetRole": "Product Manager",
  "currentRole": "Software Engineer",
  "timeline": "6 months",
  "phases": [...],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "progress": {
    "completedTasks": [],
    "currentPhase": 0,
    "streakDays": 0
  }
}
```

---

### Regenerate Plan/Phase
**PUT** `/api/plans/:planId/regenerate`

**Headers:** `Authorization: Bearer <token>`

**Request Body (Optional):**
```json
{
  "phaseNumber": 1
}
```

**Response:** `200 OK`
```json
{
  "phases": [...],
  "message": "Phase 1 regenerated successfully"
}
```

---

## Agent Endpoints

### List All Agents
**GET** `/api/agents`

**Response:** `200 OK`
```json
{
  "agents": [
    {
      "id": "alex",
      "name": "Alex",
      "role": "Career Coach",
      "personality": "Enthusiastic, motivational, celebrates wins",
      "expertise": ["motivation", "goal-setting", "mindset"]
    },
    {
      "id": "jordan",
      "name": "Jordan",
      "role": "Skills Advisor",
      "personality": "Analytical, practical, technical focus",
      "expertise": ["technical skills", "learning strategies"]
    }
  ]
}
```

---

### Get Agent Details
**GET** `/api/agents/:agentId`

**Response:** `200 OK`
```json
{
  "id": "alex",
  "name": "Alex",
  "role": "Career Coach",
  "personality": "Enthusiastic, motivational, celebrates wins",
  "expertise": ["motivation", "goal-setting", "mindset", "confidence-building"]
}
```

---

### Chat with Agent
**POST** `/api/agents/:agentId/chat`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I'm feeling overwhelmed with all the things I need to learn",
  "context": {
    "optional": "context data"
  }
}
```

**Response:** `200 OK`
```json
{
  "agentId": "alex",
  "agentName": "Alex",
  "message": "I totally understand! Starting a career transition can feel like climbing a mountain, but remember - you don't have to do it all at once! Let's break this down into smaller, manageable steps...",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Agent Conversation History
**GET** `/api/agents/:agentId/conversation?limit=20`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "agent": {
    "id": "alex",
    "name": "Alex",
    "role": "Career Coach"
  },
  "interactions": [
    {
      "id": "interaction_id",
      "message": "User's message",
      "response": "Agent's response",
      "timestamp": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Progress Endpoints

### Get Progress Stats
**GET** `/api/progress`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "streakDays": 5,
  "currentPhase": 0,
  "completedTasks": 3,
  "totalTasks": 25,
  "lastActivity": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Detailed Progress
**GET** `/api/progress/detailed`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "planId": "plan_id",
  "currentPhase": 0,
  "streakDays": 5,
  "lastActivity": "2025-01-01T00:00:00.000Z",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Foundation & Skills Assessment",
      "tasksCompleted": 3,
      "tasksTotal": 10,
      "milestones": [
        {
          "id": "milestone_1_1",
          "title": "Complete PM fundamentals course",
          "description": "Learn core PM concepts",
          "tasksCompleted": 2,
          "tasksTotal": 5,
          "tasks": [
            {
              "id": "task_1_1_1",
              "title": "Enroll in PM course",
              "completed": true
            }
          ]
        }
      ]
    }
  ]
}
```

---

### Update Task Completion
**PUT** `/api/progress/task`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "taskId": "task_1_1_1",
  "completed": true,
  "milestoneId": "milestone_1_1"
}
```

**Response:** `200 OK`
```json
{
  "streakDays": 6,
  "currentPhase": 0,
  "completedTasks": 4,
  "totalTasks": 25,
  "lastActivity": "2025-01-01T00:00:00.000Z",
  "message": "Task marked as complete!"
}
```

---

### Complete Milestone
**POST** `/api/progress/milestone/:milestoneId/complete`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "streakDays": 6,
  "currentPhase": 0,
  "completedTasks": 9,
  "totalTasks": 25,
  "lastActivity": "2025-01-01T00:00:00.000Z",
  "message": "Milestone completed! Great job!"
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "stack": "..." // Only in development mode
  }
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Agent Personas

### Alex - Career Coach
- **Personality:** Enthusiastic, motivational, celebrates wins
- **Use for:** Motivation, goal-setting, confidence building
- **Example:** "I'm feeling stuck in my transition"

### Jordan - Skills Advisor
- **Personality:** Analytical, practical, technical focus
- **Use for:** Learning resources, skill development, certifications
- **Example:** "What skills should I focus on learning?"

### Morgan - Industry Insider
- **Personality:** Connected, shares market insights
- **Use for:** Industry trends, networking, salary negotiation
- **Example:** "What's the job market like for PMs?"

### Casey - Accountability Partner
- **Personality:** Firm but kind, tracks deadlines
- **Use for:** Accountability, time management, habit formation
- **Example:** "I keep procrastinating on my tasks"

### Sam - Mentor
- **Personality:** Wise, patient, big-picture guidance
- **Use for:** Career strategy, life transitions, work-life balance
- **Example:** "How do I balance learning with my current job?"
