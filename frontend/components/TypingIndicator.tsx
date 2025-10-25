import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="h-8 w-8 bg-purple-100">
        <AvatarFallback>
          <Bot className="h-5 w-5 text-purple-600" />
        </AvatarFallback>
      </Avatar>

      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
