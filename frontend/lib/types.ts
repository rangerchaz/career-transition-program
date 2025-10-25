// User types
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Intake types
export interface IntakeSession {
  id: string
  userId: string
  messages: Message[]
  isComplete: boolean
  progress: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface IntakeRespondRequest {
  sessionId: string
  message: string
}

export interface IntakeRespondResponse {
  message: Message
  isComplete: boolean
  progress: number
}

// Career Plan types
export interface CareerPlan {
  id: string
  userId: string
  targetCareer: string
  phases: Phase[]
  createdAt: string
  updatedAt: string
}

export interface Phase {
  id: string
  title: string
  description: string
  duration: string
  order: number
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  tasks: Task[]
  isCompleted: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  resourceLinks: ResourceLink[]
  isCompleted: boolean
  dueDate?: string
}

export interface ResourceLink {
  title: string
  url: string
  type: "course" | "article" | "video" | "book"
}

// Progress types
export interface ProgressData {
  userId: string
  currentPhase: number
  totalTasks: number
  completedTasks: number
  currentStreak: number
  achievements: Achievement[]
  recentMilestones: Milestone[]
  activityData: ActivityDataPoint[]
  upcomingDeadlines: Task[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
}

export interface ActivityDataPoint {
  date: string
  tasksCompleted: number
}

export interface UpdateTaskRequest {
  taskId: string
  isCompleted: boolean
}

export interface UpdateMilestoneRequest {
  milestoneId: string
  isCompleted: boolean
}

// Agent types
export interface Agent {
  id: string
  name: string
  role: string
  description: string
  personality: string
  avatar: string
  color: string
}

export interface AgentChatRequest {
  agentId: string
  message: string
  conversationId?: string
}

export interface AgentChatResponse {
  message: Message
  conversationId: string
}

export interface Conversation {
  id: string
  agentId: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}
