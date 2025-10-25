import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phase, Task } from "@/lib/types"
import { CheckCircle2, Circle, ExternalLink, Clock } from "lucide-react"

interface PhaseCardProps {
  phase: Phase
  isActive: boolean
  onTaskToggle: (taskId: string, isCompleted: boolean) => void
}

export function PhaseCard({ phase, isActive, onTaskToggle }: PhaseCardProps) {
  const totalTasks = phase.milestones.reduce((acc, m) => acc + m.tasks.length, 0)
  const completedTasks = phase.milestones.reduce(
    (acc, m) => acc + m.tasks.filter((t) => t.isCompleted).length,
    0
  )
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "course":
        return "🎓"
      case "article":
        return "📄"
      case "video":
        return "🎥"
      case "book":
        return "📚"
      default:
        return "🔗"
    }
  }

  return (
    <Card className={`${isActive ? "border-purple-500 shadow-lg" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {isActive ? (
                <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" />
              ) : (
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
              )}
              {phase.title}
            </CardTitle>
            <CardDescription className="mt-2">{phase.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {phase.duration}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {phase.milestones.map((milestone, idx) => (
            <AccordionItem key={milestone.id} value={milestone.id}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  {milestone.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium">{milestone.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-7">
                  <p className="text-sm text-gray-600">{milestone.description}</p>

                  {/* Tasks */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tasks:</h4>
                    {milestone.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={(isCompleted) => onTaskToggle(task.id, isCompleted)}
                        getResourceIcon={getResourceIcon}
                      />
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

interface TaskItemProps {
  task: Task
  onToggle: (isCompleted: boolean) => void
  getResourceIcon: (type: string) => string
}

function TaskItem({ task, onToggle, getResourceIcon }: TaskItemProps) {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-start gap-2">
        <button
          onClick={() => onToggle(!task.isCompleted)}
          className="mt-0.5 flex-shrink-0"
        >
          {task.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
        <div className="flex-1">
          <p className={`text-sm font-medium ${task.isCompleted ? "line-through text-gray-500" : ""}`}>
            {task.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">{task.description}</p>

          {/* Resource Links */}
          {task.resourceLinks && task.resourceLinks.length > 0 && (
            <div className="mt-2 space-y-1">
              {task.resourceLinks.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-purple-600 hover:text-purple-700 hover:underline"
                >
                  <span>{getResourceIcon(resource.type)}</span>
                  <span>{resource.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
