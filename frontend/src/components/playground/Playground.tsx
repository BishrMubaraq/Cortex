import * as React from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PromptColumn } from "@/components/playground/PromptColumn";
import { models, type Model } from "@/data/mock";

export function Playground() {
  const [userPrompt, setUserPrompt] = React.useState(
    "Summarize the key trade-offs between RAG and fine-tuning.",
  );
  const [modelA, setModelA] = React.useState<Model>(models[0]);
  const [modelB, setModelB] = React.useState<Model>(models[1]);
  const [systemA, setSystemA] = React.useState(
    "You are a concise research assistant. Answer with bullet points.",
  );
  const [systemB, setSystemB] = React.useState(
    "You are a thorough analyst. Explain reasoning step by step.",
  );
  const [hasRun, setHasRun] = React.useState(false);

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Prompt Playground
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare prompts and models side by side. Execution is mocked.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setHasRun(true)}>
            <Play className="h-4 w-4" />
            Run comparison
          </Button>
        </div>

        <div className="mb-6 space-y-2">
          <Label htmlFor="user-prompt">User prompt</Label>
          <Input
            id="user-prompt"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Enter the prompt sent to both variants…"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PromptColumn
            index={0}
            model={modelA}
            onModelChange={setModelA}
            systemPrompt={systemA}
            onSystemPromptChange={setSystemA}
            hasRun={hasRun}
          />
          <PromptColumn
            index={1}
            model={modelB}
            onModelChange={setModelB}
            systemPrompt={systemB}
            onSystemPromptChange={setSystemB}
            hasRun={hasRun}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
