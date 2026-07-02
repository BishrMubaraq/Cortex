import {
  FileSpreadsheet,
  FileText,
  FileType,
  Globe,
  Hash,
  Loader2,
  MoreHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DocType, KnowledgeDoc } from "@/data/mock";

const iconFor: Record<DocType, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  doc: FileType,
  sheet: FileSpreadsheet,
  markdown: Hash,
  web: Globe,
};

export function DocumentCard({ doc }: { doc: KnowledgeDoc }) {
  const Icon = iconFor[doc.type];
  const indexed = doc.status === "Indexed";

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-border/80 hover:bg-accent/30">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {doc.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {doc.size} · {doc.date}
        </p>
      </div>
      {indexed ? (
        <Badge variant="success">Indexed</Badge>
      ) : (
        <Badge variant="warning">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </Badge>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Document actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
