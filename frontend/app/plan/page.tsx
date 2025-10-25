"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { planApi, progressApi, handleApiError } from "@/lib/api"
import { CareerPlan } from "@/lib/types"
import { PhaseCard } from "@/components/PhaseCard"
import { Button } from "@/components/ui/button"
import { Download, MessageCircle } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Link from "next/link"

function PlanContent() {
  const { user } = useAuth()
  const [plan, setPlan] = useState<CareerPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return

      try {
        const userPlan = await planApi.getUserPlan()
        setPlan(userPlan)

        // Determine current phase based on first incomplete phase
        const firstIncompletePhase = userPlan.phases.findIndex((phase) =>
          phase.milestones.some((m) => !m.isCompleted)
        )
        setCurrentPhaseIndex(firstIncompletePhase >= 0 ? firstIncompletePhase : userPlan.phases.length - 1)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [user])

  const handleTaskToggle = async (taskId: string, isCompleted: boolean) => {
    try {
      await progressApi.updateTask({ taskId, isCompleted })

      // Update local state
      setPlan((prevPlan) => {
        if (!prevPlan) return prevPlan

        return {
          ...prevPlan,
          phases: prevPlan.phases.map((phase) => ({
            ...phase,
            milestones: phase.milestones.map((milestone) => ({
              ...milestone,
              tasks: milestone.tasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted } : task
              ),
            })),
          })),
        }
      })
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const handleExportPDF = () => {
    // This would integrate with a PDF library like jsPDF or html2pdf
    // For now, we'll use the browser's print functionality
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Plan Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't completed your intake yet. Let's get started!
          </p>
          <Link href="/intake">
            <Button>Start Intake</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!plan) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Career Roadmap</h1>
              <p className="text-gray-600 mt-1">Transitioning to: {plan.targetCareer}</p>
            </div>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {plan.phases.map((phase, index) => (
            <div key={phase.id} className="relative">
              {/* Timeline connector */}
              {index < plan.phases.length - 1 && (
                <div className="absolute left-8 top-full h-6 w-0.5 bg-gray-300 -z-10" />
              )}

              <PhaseCard
                phase={phase}
                isActive={index === currentPhaseIndex}
                onTaskToggle={handleTaskToggle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Chat Button */}
      <Link href="/agents">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 rounded-full shadow-lg h-14 w-14 p-0"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  )
}

export default function PlanPage() {
  return (
    <ProtectedRoute>
      <PlanContent />
    </ProtectedRoute>
  )
}
