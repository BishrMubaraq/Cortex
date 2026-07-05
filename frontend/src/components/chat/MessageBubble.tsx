import { AlertTriangle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { CitationChips } from "@/components/chat/CitationChips";
import type { ChatMessage } from "@/data/mock";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isError = Boolean(message.error);

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-lg rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
          isError
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : "border-border bg-card text-primary",
        )}
      >
        {isError ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>
      <div className="max-w-[80%]">
        <div
          className={cn(
            "whitespace-pre-wrap rounded-lg rounded-tl-sm border px-4 py-3 text-sm leading-relaxed",
            isError
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border bg-card text-card-foreground",
          )}
        >
          {message.content}
        </div>
        {message.citations && message.citations.length > 0 && (
          <CitationChips citations={message.citations} />
        )}
      </div>
    </div>
  );
}
