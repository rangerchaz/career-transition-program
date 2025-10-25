"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { intakeApi, planApi, handleApiError } from "@/lib/api"
import { Message, IntakeSession } from "@/lib/types"
import { ChatMessage } from "@/components/ChatMessage"
import { TypingIndicator } from "@/components/TypingIndicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Send, RotateCcw } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"

function IntakeContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [session, setSession] = useState<IntakeSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Initialize intake session
  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await intakeApi.startSession()
        // Backend returns { sessionId, question, currentStep, isComplete }
        const sessionData: any = response as any
        setSession({
          id: sessionData.sessionId,
          userId: user?.id || '',
          messages: [],
          isComplete: sessionData.isComplete || false,
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        // Add the first question as an assistant message
        if (sessionData.question) {
          const firstMessage: Message = {
            id: '1',
            role: 'assistant',
            content: sessionData.question,
            timestamp: new Date().toISOString(),
          }
          setMessages([firstMessage])
        } else {
          setMessages([])
        }
        setProgress(0)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    initSession()
  }, [user])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setError("")

    try {
      const response = await intakeApi.respond({
        sessionId: session.id,
        message: userMessage.content,
      })

      // Backend returns { question, isComplete, currentStep }
      const responseData: any = response as any

      // Simulate AI typing delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseData.question || '',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        // Calculate progress based on currentStep (assuming ~10 steps total)
        const progressPercent = Math.min((responseData.currentStep / 10) * 100, 100)
        setProgress(progressPercent)
        setIsTyping(false)

        // Check if intake is complete
        if (responseData.isComplete) {
          handleIntakeComplete()
        }
      }, 800)
    } catch (err) {
      setError(handleApiError(err))
      setIsTyping(false)
    }
  }

  const handleIntakeComplete = async () => {
    if (!session) return

    try {
      // Generate career plan
      await planApi.generate(session.id)

      // Redirect to plan page after a short delay
      setTimeout(() => {
        router.push("/plan")
      }, 1500)
    } catch (err) {
      setError(handleApiError(err))
    }
  }

  const handleStartOver = async () => {
    if (confirm("Are you sure you want to start over? This will clear your current progress.")) {
      setIsLoading(true)
      try {
        const response = await intakeApi.startSession()
        const sessionData: any = response as any
        setSession({
          id: sessionData.sessionId,
          userId: user?.id || '',
          messages: [],
          isComplete: sessionData.isComplete || false,
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        if (sessionData.question) {
          const firstMessage: Message = {
            id: '1',
            role: 'assistant',
            content: sessionData.question,
            timestamp: new Date().toISOString(),
          }
          setMessages([firstMessage])
        } else {
          setMessages([])
        }
        setProgress(0)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header with Progress */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900">Career Intake</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOver}
              disabled={isTyping}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} showTimestamp />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IntakePage() {
  return (
    <ProtectedRoute>
      <IntakeContent />
    </ProtectedRoute>
  )
}
