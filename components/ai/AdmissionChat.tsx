"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export function AdmissionChat() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I'm the RMVK College Admission Assistant. Ask me about eligibility, documents, fees, or how to apply.",
    },
  ]);
  const sessionId = useRef(typeof crypto !== "undefined" ? crypto.randomUUID() : "session");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    const assistantIdx = messages.length + 1;
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: text, session_id: sessionId.current, stream: true }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setMessages((m) => {
          const copy = [...m];
          copy[assistantIdx] = { role: "assistant", content: data.error ?? "Sorry, something went wrong." };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      let sources: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(line.slice(6)) as {
              type: string; text?: string; sources?: string[]; error?: string;
            };
            if (evt.type === "token" && evt.text) {
              content += evt.text;
              setMessages((m) => {
                const copy = [...m];
                copy[assistantIdx] = { role: "assistant", content, sources };
                return copy;
              });
            } else if (evt.type === "done" && evt.sources) {
              sources = evt.sources;
            } else if (evt.type === "error") {
              content = evt.error ?? content;
            }
          } catch {
            /* ignore */
          }
        }
      }

      setMessages((m) => {
        const copy = [...m];
        copy[assistantIdx] = { role: "assistant", content: content || "No response.", sources };
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[assistantIdx] = {
          role: "assistant",
          content: "Sorry, I couldn't reach the server. Please try again or email rkm.narainpur@gmail.com.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0D2660] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#071540] transition-colors"
        aria-label="Open admission assistant chat"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-semibold hidden sm:inline">Ask Admissions</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Admission assistant"
          className="fixed bottom-20 right-5 z-50 w-[min(100vw-2rem,380px)] bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col max-h-[min(70vh,520px)]"
        >
          <div className="navy-gradient text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">Admission Assistant</div>
              <div className="text-xs text-blue-200">RKM Vivekananda College Narayanpur</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 hover:bg-white/10 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  msg.role === "user"
                    ? "bg-[#0D2660] text-white"
                    : "bg-blue-50 text-gray-800"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.sources.map((s) => (
                        <Link key={s} href={s} className="text-xs underline text-[#C8201A]" onClick={() => setOpen(false)}>
                          {s}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 animate-pulse">Thinking…</div>}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-gray-100 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about admissions…"
              aria-label="Chat message"
              className="text-sm"
            />
            <Button type="button" onClick={send} disabled={loading} size="icon" className="bg-[#C8201A] hover:bg-[#9B1812] shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 px-4 pb-3">
            For complex cases, email{" "}
            <a href="mailto:rkm.narainpur@gmail.com" className="underline">rkm.narainpur@gmail.com</a>
          </p>
        </div>
      )}
    </>
  );
}
