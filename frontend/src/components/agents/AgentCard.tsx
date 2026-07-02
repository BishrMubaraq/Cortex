import { Blocks, Play } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/data/mock";

const statusVariant: Record<Agent["status"], BadgeProps["variant"]> = {
  Active: "success",
  Draft: "outline",
  Paused: "warning",
};

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Blocks className="h-[18px] w-[18px]" />
        </div>
        <Badge variant={statusVariant[agent.status]}>{agent.status}</Badge>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-foreground">
        {agent.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
        {agent.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          {agent.runs} runs
        </span>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Play className="h-3.5 w-3.5" />
          Run
        </Button>
      </div>
    </div>
  );
}
