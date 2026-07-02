import { Sparkles } from "lucide-react";

/** Static (non-streaming) typing indicator for the assistant. */
export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-card text-primary">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-3">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground [animation-delay:0ms]" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground [animation-delay:300ms]" />
      </div>
    </div>
  );
}
