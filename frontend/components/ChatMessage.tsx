import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { Message } from "@/lib/types"
import { format } from "date-fns"

interface ChatMessageProps {
  message: Message
  showTimestamp?: boolean
}

export function ChatMessage({ message, showTimestamp = false }: ChatMessageProps) {
  const isAI = message.role === "assistant"

  return (
    <div className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"} group`}>
      {isAI && (
        <Avatar className="h-8 w-8 bg-purple-100">
          <AvatarFallback>
            <Bot className="h-5 w-5 text-purple-600" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col max-w-[70%] ${isAI ? "items-start" : "items-end"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAI
              ? "bg-white border border-gray-200 text-gray-800"
              : "bg-purple-600 text-white"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {showTimestamp && (
          <span className="text-xs text-gray-400 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {format(new Date(message.timestamp), "h:mm a")}
          </span>
        )}
      </div>

      {!isAI && (
        <Avatar className="h-8 w-8 bg-blue-100">
          <AvatarFallback>
            <User className="h-5 w-5 text-blue-600" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
