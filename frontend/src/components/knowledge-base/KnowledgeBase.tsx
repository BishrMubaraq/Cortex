import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DocumentCard } from "@/components/knowledge-base/DocumentCard";
import { UploadArea } from "@/components/knowledge-base/UploadArea";
import { documents } from "@/data/mock";
import { cn } from "@/lib/utils";

type Filter = "all" | "indexed" | "processing";

export function KnowledgeBase() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");

  const filtered = documents.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "indexed" && d.status === "Indexed") ||
      (filter === "processing" && d.status === "Processing");
    return matchesQuery && matchesFilter;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "indexed", label: "Indexed" },
    { id: "processing", label: "Processing" },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold tracking-tight">Knowledge Base</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {documents.length} sources · used to ground assistant responses
          </p>
        </div>

        <UploadArea />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === f.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              No documents match your search.
            </div>
          ) : (
            filtered.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-4 flex items-center justify-end">
            <Badge variant="outline">{filtered.length} shown</Badge>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
