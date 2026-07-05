import * as React from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/chat/EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import { ApiError, streamChat } from "@/lib/api";
import { models, type ChatMessage, type Model } from "@/data/mock";

let idCounter = 0;
const nextId = () => `local-${++idCounter}`;

/**
 * Chat screen. Streams real completions from the backend `/api/chat` (SSE):
 * append the user's message, show a typing indicator until the first token,
 * then append tokens to the assistant message as they arrive. Supports
 * cancellation via an AbortController.
 */
export function ChatView() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [typing, setTyping] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const [model, setModel] = React.useState<Model>(models[0]);
  const abortRef = React.useRef<AbortController | null>(null);

  // Abort any in-flight stream on unmount.
  React.useEffect(() => () => abortRef.current?.abort(), []);

  async function handleSend(text: string) {
    if (streaming) return;

    const userMsg: ChatMessage = { id: nextId(), role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setStreaming(true);
    setTyping(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const assistantId = nextId();
    let started = false;

    try {
      await streamChat(
        history.map((m) => ({ role: m.role, content: m.content })),
        model.id,
        (delta) => {
          if (!started) {
            started = true;
            setTyping(false);
            setMessages((prev) => [
              ...prev,
              { id: assistantId, role: "assistant", content: delta },
            ]);
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + delta }
                  : m,
              ),
            );
          }
        },
        controller.signal,
      );
    } catch (err) {
      // A user-initiated stop aborts the fetch — leave partial text as-is.
      if (err instanceof DOMException && err.name === "AbortError") {
        // no-op
      } else {
        const detail =
          err instanceof ApiError ? err.message : "Something went wrong.";
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === assistantId);
          if (exists) {
            return prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `${m.content}\n\n${detail}`, error: true }
                : m,
            );
          }
          return [
            ...prev,
            { id: assistantId, role: "assistant", content: detail, error: true },
          ];
        });
      }
    } finally {
      setTyping(false);
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
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
        streaming={streaming}
        onStop={handleStop}
      />
    </div>
  );
}
