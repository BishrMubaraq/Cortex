import * as React from "react";
import { ArrowUp, Paperclip, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModelSelector } from "@/components/chat/ModelSelector";
import type { Model } from "@/data/mock";

interface ChatInputProps {
  model: Model;
  onModelChange: (model: Model) => void;
  onSend: (text: string) => void;
  /** True while a response is streaming; shows a Stop button. */
  streaming?: boolean;
  onStop?: () => void;
}

export function ChatInput({
  model,
  onModelChange,
  onSend,
  streaming,
  onStop,
}: ChatInputProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-expand the textarea up to a max height.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || streaming) return;
    onSend(text);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-6">
      <div className="rounded-xl border border-border bg-card focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything, or reference your knowledge base…"
          className="max-h-[200px] w-full resize-none bg-transparent px-4 pt-3.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
        />
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-[18px] w-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            <ModelSelector value={model} onChange={onModelChange} />
          </div>
          {streaming ? (
            <Button
              size="icon"
              variant="secondary"
              onClick={onStop}
              aria-label="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={submit}
              disabled={!value.trim()}
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {model.name} · responses stream live from the backend.
      </p>
    </div>
  );
}
