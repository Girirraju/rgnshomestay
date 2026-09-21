import { Fragment, useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE =
  (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:5000/api";

type ChatMessage = { role: "user" | "bot"; text: string };

const FAQS = [
  "What rooms do you have and what do they cost?",
  "How do I make a reservation?",
  "What's included / what are the amenities?",
  "Where exactly is the homestay located?",
  "What's your cancellation policy?",
  "What's nearby in Karur worth visiting?",
];

const WELCOME_MESSAGE: ChatMessage = {
  role: "bot",
  text: "Vanakkam! I'm the RGN's Homestay assistant. Ask me about rooms, rates, booking, your stay, or things to see in Karur & Tamil Nadu.",
};

// Minimal, dependency-free renderer for the bot's lightweight markdown (bold + bullet lines).
function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
        const content = isBullet ? trimmed.slice(2) : line;
        const parts = content.split(/\*\*(.+?)\*\*/g);
        const rendered = parts.map((part, partIndex) =>
          partIndex % 2 === 1 ? (
            <strong key={partIndex}>{part}</strong>
          ) : (
            <Fragment key={partIndex}>{part}</Fragment>
          ),
        );
        if (!trimmed) return <br key={lineIndex} />;
        return isBullet ? (
          <div key={lineIndex} className="flex gap-2 pl-1">
            <span aria-hidden>•</span>
            <span>{rendered}</span>
          </div>
        ) : (
          <p key={lineIndex} className={lineIndex > 0 ? "mt-1.5" : undefined}>
            {rendered}
          </p>
        );
      })}
    </>
  );
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const history = nextMessages.slice(0, -1).slice(-10);
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await response.json();
      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "Sorry, I couldn't quite catch that. Please try again or call +91 70107 75902.";
      setMessages((current) => [...current, { role: "bot", text: reply }]);
    } catch {
      setError("Couldn't reach the assistant. Please check your connection and try again.");
      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text: "Sorry, I'm having trouble connecting right now. Please try again, or reach Mrs S Gowri directly at +91 70107 75902.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  const showFaqs = messages.length === 1;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div
          role="dialog"
          aria-label="RGN's Homestay chat assistant"
          className="flex h-[min(32rem,75vh)] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-warm"
        >
          <div className="flex items-center justify-between gap-3 bg-primary px-5 py-4 text-primary-foreground">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full border border-primary-foreground/30 bg-primary-foreground/10">
                <Sparkles className="size-4 text-gold-light" />
              </span>
              <div>
                <p className="font-display text-base font-semibold leading-tight">
                  Homestay Assistant
                </p>
                <p className="text-xs leading-tight opacity-75">Ask about rooms, booking & Karur</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid size-8 shrink-0 place-items-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-secondary text-foreground"
                  }`}
                >
                  <FormattedText text={message.text} />
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> Thinking…
                </div>
              </div>
            ) : null}

            {showFaqs ? (
              <div className="pt-1">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Frequently asked
                </p>
                <div className="flex flex-wrap gap-2">
                  {FAQS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void sendMessage(question)}
                      className="rounded-full border border-gold/50 bg-card px-3 py-1.5 text-left text-xs font-semibold text-primary transition-colors hover:bg-secondary"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="px-4 pb-1 text-xs text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Message"
              disabled={loading}
              className="h-11 flex-1 rounded-full"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="size-11 shrink-0 rounded-full"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-warm transition-transform hover:-translate-y-0.5"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
