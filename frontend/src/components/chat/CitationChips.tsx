import { FileText } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Citation {
  id: number;
  label: string;
}

/** Mock citation chips rendered under an assistant message. */
export function CitationChips({ citations }: { citations: Citation[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
      {citations.map((c) => (
        <Tooltip key={c.id}>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              <span className="font-medium text-primary">[{c.id}]</span>
              <FileText className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{c.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
