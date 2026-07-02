import * as React from "react";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ChatView } from "@/components/chat/ChatView";
import { KnowledgeBase } from "@/components/knowledge-base/KnowledgeBase";
import { AgentsView } from "@/components/agents/AgentsView";
import { Playground } from "@/components/playground/Playground";
import { SettingsView } from "@/components/settings/SettingsView";
import { useRouter } from "@/router/router";

const routes: Record<string, { title: string; element: React.ReactNode }> = {
  "/chat": { title: "Chat", element: <ChatView /> },
  "/knowledge": { title: "Knowledge Base", element: <KnowledgeBase /> },
  "/agents": { title: "Agents", element: <AgentsView /> },
  "/playground": { title: "Prompt Playground", element: <Playground /> },
  "/settings": { title: "Settings", element: <SettingsView /> },
};

export function AppShell() {
  const { path } = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  const current = routes[path] ?? routes["/chat"];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={current.title} />
        <main className="min-h-0 flex-1 overflow-hidden">{current.element}</main>
      </div>
    </div>
  );
}
