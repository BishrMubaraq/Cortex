import * as React from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/chat/EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import { models, type ChatMessage, type Model } from "@/data/mock";

let idCounter = 0;
const nextId = () => `local-${++idCounter}`;

/**
 * Chat screen. Fully local/mock: sending a message appends the user's message,
 * shows a static typing indicator, then appends a canned assistant reply with
 * placeholder citations. No network or LLM involved.
 */
export function ChatView() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [typing, setTyping] = React.useState(false);
  const [model, setModel] = React.useState<Model>(models[0]);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: text },
    ]);
    setTyping(true);

    timerRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content:
            "This is a mocked response. Once a model and retrieval pipeline are connected, a grounded answer with real citations will appear here.",
          citations: [
            { id: 1, label: "q3-research-report.pdf" },
            { id: 2, label: "architecture-notes.md" },
          ],
        },
      ]);
      setTyping(false);
    }, 1100);
  }

  const isEmpty = messages.length === 0 && !typing;

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        {isEmpty ? (
          <EmptyState onPick={handleSend} />
        ) : (
          <MessageList messages={messages} typing={typing} />
        )}
      </div>
      <ChatInput
        model={model}
        onModelChange={setModel}
        onSend={handleSend}
        disabled={typing}
      />
    </div>
  );
}
