import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Radio,
  SendHorizontal,
  Signal,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useChat, type ChatMessage } from "@/lib/chat-store";
import type { Station } from "@/lib/stations";
import { genreLabel } from "@/lib/stations";
import { RadioPlayer } from "./radio-player";

export function RadioChat() {
  const messages = useChat((s) => s.messages);
  const playing = useChat((s) => s.playing);
  const status = useChat((s) => s.status);
  const send = useChat((s) => s.send);
  const stop = useChat((s) => s.stop);
  const tapStation = useChat((s) => s.tapStation);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const lastKeys =
    [...messages].reverse().find(
      (m): m is Extract<ChatMessage, { role: "bot" }> => m.role === "bot" && Boolean(m.keys?.length),
    )?.keys;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(draft);
    setDraft("");
  }

  return (
    <div className="flex min-h-dvh items-stretch justify-center bg-bg">
      <RadioPlayer />
      <div className="flex w-full max-w-md flex-col bg-surface shadow-[0_0_0_1px_var(--color-border)] sm:my-0 sm:min-h-dvh">
        <header className="flex items-center gap-3 border-b border-border bg-bg px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))]">
          <div
            className="grid size-11 shrink-0 place-items-center rounded-full bg-elevated text-accent"
            aria-hidden
          >
            <Radio className="size-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">Эфир</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status === "playing" ? "bg-accent" : "bg-subtle",
                )}
              />
              {status === "playing" && playing
                ? playing.name
                : status === "loading"
                  ? "Подключаю эфир…"
                  : status === "error"
                    ? "Поток недоступен"
                    : "онлайн"}
            </p>
          </div>
          {playing ? (
            <button
              type="button"
              onClick={() => (status === "playing" ? stop() : tapStation(playing))}
              className="grid size-11 place-items-center rounded-full bg-elevated text-fg transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
              aria-label={status === "playing" ? "Стоп" : "Играть"}
            >
              {status === "playing" ? (
                <Pause className="size-4" fill="currentColor" />
              ) : (
                <Play className="size-4 translate-x-px" fill="currentColor" />
              )}
            </button>
          ) : (
            <div className="grid size-11 place-items-center text-subtle" aria-hidden>
              <Signal className="size-4" />
            </div>
          )}
        </header>

        {playing ? (
          <div className="flex items-center gap-3 border-b border-border bg-elevated px-3 py-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-bubble-out text-[10px] font-semibold uppercase tracking-wide">
              FM
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{playing.name}</p>
              <p className="truncate text-xs text-muted">
                {playing.city} · {genreLabel(playing.genre)}
              </p>
            </div>
            {status === "loading" ? (
              <span className="text-xs text-muted">буфер…</span>
            ) : null}
            {status === "error" ? (
              <span className="text-xs text-danger">ошибка потока</span>
            ) : null}
          </div>
        ) : null}

        <div
          ref={scroller}
          className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-fg) 6%, transparent) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        >
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              onPlay={tapStation}
              activeId={playing?.id}
            />
          ))}
        </div>

        {lastKeys && lastKeys.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5 border-t border-border bg-bg px-2 py-2">
            {lastKeys.map((key) => (
              <button
                key={key.id}
                type="button"
                onClick={() => send(key.id.startsWith("genre:") ? key.id : key.label)}
                className="min-h-11 rounded-md bg-elevated px-2 text-sm font-medium text-fg transition-colors duration-150 hover:bg-bubble-in"
              >
                {key.label}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={onSubmit}
          className="flex items-end gap-2 border-t border-border bg-bg px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
          <label className="sr-only" htmlFor="draft">
            Сообщение боту
          </label>
          <input
            id="draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Название станции или жанр"
            autoComplete="off"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3.5 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
          />
          <button
            type="submit"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg transition-transform duration-150 active:scale-[0.98] disabled:opacity-40"
            disabled={!draft.trim()}
            aria-label="Отправить"
          >
            <SendHorizontal className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onPlay,
  activeId,
}: {
  message: ChatMessage;
  onPlay: (s: Station) => void;
  activeId?: string;
}) {
  if (message.role === "user") {
    return (
      <div className="ml-10 flex justify-end">
        <p className="max-w-[85%] rounded-[16px] rounded-br-sm bg-bubble-out px-3 py-2 text-sm leading-snug">
          {message.text}
        </p>
      </div>
    );
  }

  return (
    <div className="mr-8 flex justify-start">
      <div className="max-w-[92%] rounded-[16px] rounded-bl-sm bg-bubble-in px-3 py-2 text-sm leading-snug">
        <p className="whitespace-pre-line">{message.text}</p>
        {message.stations ? (
          <ul className="mt-2 space-y-1.5">
            {message.stations.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onPlay(s)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-150",
                    activeId === s.id ? "bg-bubble-out" : "bg-elevated hover:bg-surface",
                  )}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-bg text-accent">
                    <Play className="size-3.5 translate-x-px" fill="currentColor" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{s.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {s.city} · {genreLabel(s.genre)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
