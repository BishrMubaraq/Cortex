import * as React from "react";
import { UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

/** Drag-and-drop styled upload zone. Purely visual — no real upload. */
export function UploadArea() {
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center transition-colors",
        dragging
          ? "border-primary/60 bg-primary/5"
          : "border-border bg-card/40 hover:border-border/80",
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <UploadCloud className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Drag & drop files to upload
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        PDF, DOCX, Markdown, or paste a URL — up to 25 MB each
      </p>
      <button className="mt-4 text-sm font-medium text-primary hover:underline">
        or browse files
      </button>
    </div>
  );
}
