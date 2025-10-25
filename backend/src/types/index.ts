// Type definitions for the Career Transition AI Platform

export interface IntakeData {
  currentRole?: string;
  targetRole?: string;
  timeline?: string;
  skills?: string[];
  constraints?: {
    time?: string;
    budget?: string;
    location?: string;
  };
  motivations?: string;
  experience?: string;
  education?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PlanPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  description: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  estimatedDuration: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  completed?: boolean;
}

export interface Resource {
  type: 'article' | 'course' | 'book' | 'video' | 'tool' | 'other';
  title: string;
  url?: string;
  description?: string;
}

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise: string[];
  avatar: string;
  color: string;
  description: string;
  systemPrompt: string;
}

export interface AgentChatRequest {
  message: string;
  context?: Record<string, unknown>;
}

export interface AgentChatResponse {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  };
  conversationId: string;
}

// Request/Response types for API endpoints
export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface IntakeMessageRequest {
  message: string;
}

export interface IntakeMessageResponse {
  question: string;
  isComplete: boolean;
  currentStep: number;
}

export interface GeneratePlanRequest {
  sessionId: string;
}

export interface UpdateProgressRequest {
  taskId: string;
  completed: boolean;
  milestoneId?: string;
}

export interface ProgressStats {
  streakDays: number;
  currentPhase: number;
  completedTasks: number;
  totalTasks: number;
  lastActivity: Date;
}
