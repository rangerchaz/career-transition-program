import axios, { AxiosError } from "axios"
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  IntakeSession,
  IntakeRespondRequest,
  IntakeRespondResponse,
  CareerPlan,
  ProgressData,
  UpdateTaskRequest,
  UpdateMilestoneRequest,
  Agent,
  AgentChatRequest,
  AgentChatResponse,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>
    return axiosError.response?.data?.message || axiosError.message || "An error occurred"
  }
  return "An unexpected error occurred"
}

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/register", data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/login", data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/api/auth/me")
    return response.data
  },
}

// Intake API
export const intakeApi = {
  startSession: async (): Promise<IntakeSession> => {
    const response = await api.post<IntakeSession>("/api/intake/start")
    return response.data
  },

  respond: async (data: IntakeRespondRequest): Promise<IntakeRespondResponse> => {
    const response = await api.post<IntakeRespondResponse>(
      `/api/intake/${data.sessionId}/message`,
      { message: data.message }
    )
    return response.data
  },

  getSession: async (sessionId: string): Promise<IntakeSession> => {
    const response = await api.get<IntakeSession>(`/api/intake/session/${sessionId}`)
    return response.data
  },
}

// Plan API
export const planApi = {
  generate: async (sessionId: string): Promise<CareerPlan> => {
    const response = await api.post<CareerPlan>("/api/plans/generate", { sessionId })
    return response.data
  },

  getUserPlan: async (): Promise<CareerPlan> => {
    const response = await api.get<CareerPlan>("/api/plans")
    return response.data
  },
}

// Progress API
export const progressApi = {
  getProgress: async (): Promise<ProgressData> => {
    const response = await api.get<ProgressData>("/api/progress")
    return response.data
  },

  updateTask: async (data: UpdateTaskRequest): Promise<void> => {
    await api.put("/api/progress/task", data)
  },

  completeMilestone: async (milestoneId: string): Promise<void> => {
    await api.post(`/api/progress/milestone/${milestoneId}/complete`)
  },
}

// Agent API
export const agentApi = {
  getAgents: async (): Promise<Agent[]> => {
    const response = await api.get<{ agents: Agent[] }>("/api/agents")
    return response.data.agents
  },

  chat: async (data: AgentChatRequest): Promise<AgentChatResponse> => {
    const response = await api.post<AgentChatResponse>(
      `/api/agents/${data.agentId}/chat`,
      { message: data.message, context: data.conversationId ? { conversationId: data.conversationId } : undefined }
    )
    return response.data
  },
}

export default api
