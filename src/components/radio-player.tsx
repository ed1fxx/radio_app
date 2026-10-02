import { useEffect, useRef } from "react";
import { useChat } from "@/lib/chat-store";

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playing = useChat((s) => s.playing);
  const setStatus = useChat((s) => s.setStatus);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!playing) {
      el.pause();
      el.removeAttribute("src");
      el.load();
      return;
    }
    el.src = playing.stream;
    const play = el.play();
    if (play) play.catch(() => setStatus("error"));
  }, [playing, setStatus]);

  return (
    <audio
      ref={audioRef}
      className="hidden"
      preload="none"
      onPlaying={() => setStatus("playing")}
      onWaiting={() => setStatus("loading")}
      onError={() => setStatus("error")}
      onEnded={() => setStatus("idle")}
    />
  );
}
