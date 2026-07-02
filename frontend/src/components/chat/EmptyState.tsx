import { Sparkles } from "lucide-react";

import { examplePrompts } from "@/data/mock";

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">
          How can I help with your research?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask a question, summarize documents, or compare approaches. Try one of
          these to get started.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {examplePrompts.map((ex) => (
            <button
              key={ex.title}
              onClick={() => onPick(ex.prompt)}
              className="group rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <p className="text-sm font-medium text-foreground">{ex.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{ex.prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
