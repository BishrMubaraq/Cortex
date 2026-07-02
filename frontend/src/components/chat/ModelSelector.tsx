import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { models, type Model } from "@/data/mock";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: Model;
  onChange: (model: Model) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-medium text-foreground">{value.name}</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => onChange(model)}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-foreground">{model.name}</span>
              <span className="text-xs text-muted-foreground">
                {model.vendor}
              </span>
            </div>
            <Check
              className={cn(
                "h-4 w-4",
                value.id === model.id ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
