import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Agent } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AgentCardProps {
  agent: Agent
  onClick: () => void
  isActive: boolean
}

export function AgentCard({ agent, onClick, isActive }: AgentCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isActive ? `border-2 shadow-lg` : "hover:border-gray-300"
      }`}
      style={{
        borderColor: isActive ? agent.color : undefined,
      }}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12" style={{ backgroundColor: `${agent.color}20` }}>
            <AvatarFallback style={{ color: agent.color }}>
              <span className="text-2xl">{agent.avatar}</span>
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <p className="text-sm font-medium" style={{ color: agent.color }}>
              {agent.role}
            </p>
            <CardDescription className="mt-2 line-clamp-2">
              {agent.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
