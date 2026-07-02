import { ArrowRight, CheckCircle2, Filter, PenLine, Wand2 } from "lucide-react";

import { pipelineStages } from "@/data/mock";

const stageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  retrieve: Filter,
  synthesize: PenLine,
  critique: CheckCircle2,
  refine: Wand2,
};

/** CSS-based pipeline visual: Retrieve -> Synthesize -> Critique -> Refine. */
export function PipelineVisual() {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      {pipelineStages.map((stage, i) => {
        const Icon = stageIcons[stage.id];
        return (
          <div key={stage.id} className="flex items-center gap-2 sm:flex-1">
            <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {stage.label}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {stage.description}
                </p>
              </div>
            </div>
            {i < pipelineStages.length - 1 && (
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground/60 sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}
