"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { progressApi, handleApiError } from "@/lib/api"
import { ProgressData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Target, CheckCircle2, Flame, Trophy, Calendar, MessageCircle } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Link from "next/link"
import { format } from "date-fns"

function DashboardContent() {
  const { user } = useAuth()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return

      try {
        const data = await progressApi.getProgress()
        setProgressData(data)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Progress Data</h2>
          <p className="text-gray-600 mb-6">
            Start your journey by completing the intake and viewing your plan.
          </p>
          <Link href="/intake">
            <Button>Start Intake</Button>
          </Link>
        </div>
      </div>
    )
  }

  const completionPercentage = (progressData.completedTasks / progressData.totalTasks) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 mt-1">Here's your progress overview</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Phase</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Phase {progressData.currentPhase + 1}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep up the great work!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {progressData.completedTasks}/{progressData.totalTasks}
                </div>
                <Progress value={completionPercentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressData.currentStreak} days</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {progressData.currentStreak > 0 ? "You're on fire!" : "Start your streak today!"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressData.achievements.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Badges earned
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Your daily task completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData.activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => format(new Date(value), "MMM d")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasksCompleted"
                      stroke="#9333ea"
                      strokeWidth={2}
                      dot={{ fill: "#9333ea" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressData.upcomingDeadlines.length > 0 ? (
                    progressData.upcomingDeadlines.slice(0, 5).map((task) => (
                      <div key={task.id} className="border-l-2 border-purple-600 pl-3 py-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        {task.dueDate && (
                          <p className="text-xs text-gray-500">
                            Due: {format(new Date(task.dueDate), "MMM d")}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming deadlines</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Milestones and Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Milestones</CardTitle>
                <CardDescription>Celebrate your achievements!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.recentMilestones.length > 0 ? (
                    progressData.recentMilestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{milestone.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No milestones completed yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements/Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Badges you've earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {progressData.achievements.length > 0 ? (
                    progressData.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg text-center"
                      >
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <p className="text-xs font-medium">{achievement.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-6">
                      <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Complete tasks to earn badges!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link href="/plan">
                  <Button>View My Plan</Button>
                </Link>
                <Link href="/agents">
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Advisor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
