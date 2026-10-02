import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { connectTelegramBot, pollTelegramBot } from "@/lib/telegram";

const STORAGE_KEY = "efir-telegram-token";

type Props = {
  open: boolean;
  onClose: () => void;
  onStatus: (label: string | null) => void;
};

export function TelegramConnect({ open, onClose, onStatus }: Props) {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const offsetRef = useRef(0);
  const stopRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!username) return;
    stopRef.current = false;
    let cancelled = false;

    async function loop() {
      while (!cancelled && !stopRef.current) {
        try {
          const result = await pollTelegramBot({
            data: { token, offset: offsetRef.current || undefined },
          });
          if (cancelled) return;
          offsetRef.current = result.offset;
          if (result.events.length) {
            setLog((prev) => [...result.events, ...prev].slice(0, 12));
          }
        } catch (err) {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : "Ошибка опроса Telegram");
          await new Promise((r) => setTimeout(r, 2500));
        }
      }
    }

    void loop();
    return () => {
      cancelled = true;
      stopRef.current = true;
    };
  }, [username, token]);

  async function onConnect(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const me = await connectTelegramBot({ data: { token: token.trim() } });
      localStorage.setItem(STORAGE_KEY, token.trim());
      setUsername(me.username);
      onStatus(me.username ? `@${me.username}` : me.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось подключить бота");
      setUsername(null);
      onStatus(null);
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    stopRef.current = true;
    setUsername(null);
    onStatus(null);
    localStorage.removeItem(STORAGE_KEY);
    setLog([]);
    offsetRef.current = 0;
  }

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-bg/95 px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Telegram-бот</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full bg-elevated"
          aria-label="Закрыть"
        >
          <X className="size-4" />
        </button>
      </div>

      <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-sm leading-snug text-muted">
        <li>
          Откройте{" "}
          <a
            className="text-accent underline-offset-2 hover:underline"
            href="https://t.me/BotFather"
            target="_blank"
            rel="noreferrer"
          >
            @BotFather
          </a>
        </li>
        <li>Команда /newbot — имя и username</li>
        <li>Скопируйте токен и вставьте сюда</li>
      </ol>

      {username ? (
        <div className="space-y-3">
          <p className="rounded-lg bg-elevated px-3 py-2 text-sm">
            Подключено:{" "}
            <a
              className="font-medium text-accent"
              href={`https://t.me/${username}`}
              target="_blank"
              rel="noreferrer"
            >
              @{username}
            </a>
          </p>
          <p className="text-xs text-muted">
            Оставьте эту страницу открытой — бот отвечает, пока открыт Эфир.
          </p>
          <button
            type="button"
            onClick={disconnect}
            className="min-h-11 w-full rounded-xl bg-elevated text-sm font-medium"
          >
            Отключить
          </button>
          {log.length > 0 ? (
            <ul className="space-y-1 text-xs text-muted">
              {log.map((line, i) => (
                <li key={`${i}-${line}`} className="truncate">
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-subtle">Жду сообщения в Telegram…</p>
          )}
        </div>
      ) : (
        <form onSubmit={onConnect} className="space-y-3">
          <label className="block text-xs font-medium text-muted" htmlFor="tg-token">
            Токен бота
          </label>
          <input
            id="tg-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="123456:ABC…"
            className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none placeholder:text-subtle focus:border-accent"
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={busy || token.trim().length < 20}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-fg disabled:opacity-40"
          >
            <Send className="size-4" />
            {busy ? "Проверяю…" : "Подключить"}
          </button>
        </form>
      )}
    </div>
  );
}
