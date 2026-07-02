import { Clock, Coins, Hash } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ModelSelector } from "@/components/chat/ModelSelector";
import type { Model } from "@/data/mock";

interface PromptColumnProps {
  index: number;
  model: Model;
  onModelChange: (model: Model) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  hasRun: boolean;
}

export function PromptColumn({
  index,
  model,
  onModelChange,
  systemPrompt,
  onSystemPromptChange,
  hasRun,
}: PromptColumnProps) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Variant {String.fromCharCode(65 + index)}
        </span>
        <ModelSelector value={model} onChange={onModelChange} />
      </div>

      <div className="space-y-2 p-4">
        <Label htmlFor={`system-${index}`}>System prompt</Label>
        <Textarea
          id={`system-${index}`}
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="You are a helpful research assistant…"
          className="min-h-[120px] resize-none font-mono text-xs leading-relaxed"
        />
      </div>

      <Separator />

      <div className="flex-1 p-4">
        <Label className="text-muted-foreground">Output</Label>
        <div className="mt-2 min-h-[140px] rounded-md border border-border bg-background/50 p-3 text-sm">
          {hasRun ? (
            <p className="leading-relaxed text-foreground/90">
              This is a mocked completion for variant{" "}
              {String.fromCharCode(65 + index)} using {model.name}. Wire up a
              real model to see actual output here.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Run a comparison to see output.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {hasRun ? "842 ms" : "—"}
        </span>
        <span className="flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5" />
          {hasRun ? "1,204 tok" : "—"}
        </span>
        <span className="flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5" />
          {hasRun ? "$0.014" : "—"}
        </span>
      </div>
    </div>
  );
}
