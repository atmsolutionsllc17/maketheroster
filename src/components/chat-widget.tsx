"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm the Make The Roster assistant. Ask me anything — how to build a profile, pricing, how coaches find athletes, and more.";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const history = [...messages, { role: "user" as const, content: text }];
    // Add the user message + an empty assistant slot we stream into.
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Drop the greeting from what we send to the model.
        body: JSON.stringify({ messages: history.filter((_, i) => i !== 0) }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
      if (!acc.trim()) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: "Sorry — I didn't catch that. Could you rephrase?",
          };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Sorry — I couldn't reach the assistant. Please try again.",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full bg-[#4f7cff] text-white shadow-lg shadow-black/20 transition hover:bg-[#3f6ae6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f7cff] focus-visible:ring-offset-2"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] flex h-[min(32rem,75vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          <header className="flex items-center gap-3 border-b border-neutral-100 bg-[#4f7cff] px-4 py-3 text-white">
            <MessageCircle className="size-5" />
            <div className="leading-tight">
              <p className="text-sm font-semibold">Make The Roster Assistant</p>
              <p className="text-[11px] text-white/80">Ask about recruiting, profiles & pricing</p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm " +
                    (m.role === "user"
                      ? "bg-[#4f7cff] text-white"
                      : "bg-neutral-100 text-neutral-800")
                  }
                >
                  {m.content || (busy && i === messages.length - 1 ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    ""
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-center gap-2 border-t border-neutral-100 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="min-w-0 flex-1 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#4f7cff] focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#4f7cff] text-white transition hover:bg-[#3f6ae6] disabled:opacity-40"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
