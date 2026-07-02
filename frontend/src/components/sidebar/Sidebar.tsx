import * as React from "react";
import {
  Blocks,
  BookOpen,
  ChevronLeft,
  MessageSquare,
  Plus,
  Settings,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useRouter } from "@/router/router";
import { recentChats } from "@/data/mock";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Chat", to: "/chat", icon: MessageSquare },
  { label: "Knowledge Base", to: "/knowledge", icon: BookOpen },
  { label: "Agents", to: "/agents", icon: Blocks },
  { label: "Prompt Playground", to: "/playground", icon: SlidersHorizontal },
  { label: "Settings", to: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { path } = useRouter();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card/40 transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold tracking-tight">
            Research Assistant
          </span>
        )}
      </div>

      {/* New chat */}
      <div className="px-3 pb-2 pt-1">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="w-full" aria-label="New chat">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New Chat</TooltipContent>
          </Tooltip>
        ) : (
          <Button className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-2">
        {navItems.map((item) => {
          const active = path === item.to;
          const link = (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            link
          );
        })}
      </nav>

      {/* Recent chats */}
      {!collapsed && (
        <div className="flex min-h-0 flex-1 flex-col px-3 pt-3">
          <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground">
            Recent
          </p>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-0.5 pr-1">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  className="group flex flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent/60"
                >
                  <span className="truncate text-sm text-foreground/90">
                    {chat.title}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {chat.preview}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {collapsed && <div className="flex-1" />}

      {/* Collapse toggle */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "w-full text-muted-foreground",
            collapsed ? "justify-center px-0" : "justify-start gap-2",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180",
            )}
          />
          {!collapsed && "Collapse"}
        </Button>
      </div>
    </aside>
  );
}
