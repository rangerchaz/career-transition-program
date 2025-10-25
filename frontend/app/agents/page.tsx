"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { agentApi, handleApiError } from "@/lib/api"
import { Agent, Message } from "@/lib/types"
import { AgentCard } from "@/components/AgentCard"
import { ChatMessage } from "@/components/ChatMessage"
import { TypingIndicator } from "@/components/TypingIndicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, ArrowLeft } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"

function AgentsContent() {
  const { user } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [conversations, setConversations] = useState<Record<string, Message[]>>({})
  const [conversationIds, setConversationIds] = useState<Record<string, string>>({})
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations, isTyping, selectedAgent])

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentList = await agentApi.getAgents()
        setAgents(agentList)

        // Initialize empty conversations for each agent
        const initialConversations: Record<string, Message[]> = {}
        agentList.forEach((agent) => {
          initialConversations[agent.id] = []
        })
        setConversations(initialConversations)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedAgent || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    }

    // Add user message to conversation
    setConversations((prev) => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id] || []), userMessage],
    }))

    setInputValue("")
    setIsTyping(true)
    setError("")

    try {
      const response = await agentApi.chat({
        agentId: selectedAgent.id,
        message: userMessage.content,
        conversationId: conversationIds[selectedAgent.id],
      })

      // Store conversation ID
      if (!conversationIds[selectedAgent.id]) {
        setConversationIds((prev) => ({
          ...prev,
          [selectedAgent.id]: response.conversationId,
        }))
      }

      // Simulate AI typing delay
      setTimeout(() => {
        setConversations((prev) => ({
          ...prev,
          [selectedAgent.id]: [...(prev[selectedAgent.id] || []), response.message],
        }))
        setIsTyping(false)
      }, 800)
    } catch (err) {
      setError(handleApiError(err))
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Career Advisors</h1>
          <p className="text-gray-600 mt-1">
            Chat with specialized AI agents to get personalized guidance
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!selectedAgent ? (
          // Agent Selection View
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Choose an Advisor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => setSelectedAgent(agent)}
                  isActive={false}
                />
              ))}
            </div>
          </div>
        ) : (
          // Chat View
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedAgent(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Advisors
            </Button>

            <Card>
              {/* Agent Header */}
              <CardHeader
                className="border-b"
                style={{ backgroundColor: `${selectedAgent.color}10` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedAgent.avatar}</span>
                  <div>
                    <CardTitle>{selectedAgent.name}</CardTitle>
                    <p className="text-sm" style={{ color: selectedAgent.color }}>
                      {selectedAgent.role}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                  {conversations[selectedAgent.id]?.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                      <span className="text-6xl mb-4 block">{selectedAgent.avatar}</span>
                      <p className="text-lg font-medium">{selectedAgent.name}</p>
                      <p className="text-sm mt-2">{selectedAgent.description}</p>
                      <p className="text-sm mt-4 italic">Start the conversation below!</p>
                    </div>
                  ) : (
                    <>
                      {conversations[selectedAgent.id]?.map((message) => (
                        <ChatMessage key={message.id} message={message} showTimestamp />
                      ))}
                      {isTyping && <TypingIndicator />}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="px-6 pb-4">
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask ${selectedAgent.name} anything...`}
                      disabled={isTyping}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      style={{ backgroundColor: selectedAgent.color }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgentsPage() {
  return (
    <ProtectedRoute>
      <AgentsContent />
    </ProtectedRoute>
  )
}
