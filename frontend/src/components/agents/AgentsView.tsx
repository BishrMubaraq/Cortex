import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentCard } from "@/components/agents/AgentCard";
import { PipelineVisual } from "@/components/agents/PipelineVisual";
import { agents } from "@/data/mock";

export function AgentsView() {
  return (
    <ScrollArea className="h-full">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Agents & Workflows
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Multi-step research pipelines. Configuration is mocked for now.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Agent
          </Button>
        </div>

        <div className="mb-8 rounded-lg border border-border bg-card/40 p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Default pipeline
          </p>
          <PipelineVisual />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
