import { interpret } from "./bot-replies";
import { GENRES, type Station } from "./stations";
import { create } from "zustand";
import type { KeyboardKey } from "./bot-replies";

export type { KeyboardKey };

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "bot";
      text: string;
      stations?: Station[];
      keys?: KeyboardKey[];
    };

type ChatState = {
  messages: ChatMessage[];
  playing: Station | null;
  status: "idle" | "loading" | "playing" | "error";
  send: (text: string) => void;
  tapStation: (station: Station) => void;
  setStatus: (status: ChatState["status"]) => void;
  stop: () => void;
};

let seq = 0;
const nid = () => `m-${Date.now()}-${++seq}`;

function toMessage(reply: ReturnType<typeof interpret>): ChatMessage {
  return {
    id: nid(),
    role: "bot",
    text: reply.text,
    stations: reply.stations,
    keys: reply.keys,
  };
}

function userFacing(text: string) {
  if (text.startsWith("genre:")) {
    return GENRES.find((g) => g.id === text.slice(6))?.label ?? text;
  }
  return text;
}

const welcome = () => toMessage(interpret("/start", null));

export const useChat = create<ChatState>((set, get) => ({
  messages: [welcome()],
  playing: null,
  status: "idle",
  setStatus: (status) => set({ status }),
  stop: () => set({ playing: null, status: "idle" }),
  tapStation: (station) => {
    const reply = interpret(`play:${station.id}`, get().playing);
    set((state) => ({
      playing: station,
      status: "loading",
      messages: [...state.messages, toMessage(reply)],
    }));
  },
  send: (raw) => {
    const text = raw.trim();
    if (!text) return;
    const playing = get().playing;
    const reply = interpret(text, playing);
    set((state) => ({
      playing: reply.stop ? null : reply.play ? reply.play : state.playing,
      status: reply.stop ? "idle" : reply.play ? "loading" : state.status,
      messages: [
        ...state.messages,
        { id: nid(), role: "user", text: userFacing(text) },
        toMessage(reply),
      ],
    }));
  },
}));
