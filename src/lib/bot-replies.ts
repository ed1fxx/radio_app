import {
  type GenreId,
  type Station,
  GENRES,
  STATIONS,
  findStations,
  genreLabel,
  randomStation,
  stationsByGenre,
} from "./stations";

export type KeyboardKey = { id: string; label: string };

export type BotReply = {
  text: string;
  keys: KeyboardKey[];
  stations?: Station[];
  play?: Station;
  stop?: boolean;
};

export const MAIN_KEYS: KeyboardKey[] = [
  { id: "genres", label: "Жанры" },
  { id: "all", label: "Все станции" },
  { id: "random", label: "Случайная" },
  { id: "now", label: "Сейчас" },
  { id: "stop", label: "Стоп" },
];

export function interpret(
  raw: string,
  playing: Station | null,
  channel: "web" | "telegram" = "web",
): BotReply {
  const text = raw.trim();
  const lower = text.toLowerCase();

  if (lower.startsWith("genre:")) {
    const id = lower.slice(6) as GenreId;
    const genre = GENRES.find((g) => g.id === id);
    return interpret(genre?.label ?? text, playing, channel);
  }

  if (lower.startsWith("play:")) {
    const id = lower.slice(5);
    const station = STATIONS.find((s) => s.id === id);
    if (station) return playReply(station, channel);
  }

  if (lower === "/start" || lower === "меню" || lower === "старт") {
    return {
      text:
        channel === "telegram"
          ? "Эфир — простой радио-бот. Выберите жанр или станцию. Нажмите станцию — пришлю ссылку на прямой эфир."
          : "Эфир — простой радио-бот. Выберите жанр, напишите название станции или нажмите «Случайная».",
      keys: MAIN_KEYS,
    };
  }

  if (lower === "стоп" || lower === "/stop") {
    return {
      text: playing ? `Останавливаю «${playing.name}».` : "Сейчас ничего не играет.",
      keys: MAIN_KEYS,
      stop: true,
    };
  }

  if (lower === "сейчас" || lower === "/now") {
    if (!playing) {
      return { text: "Эфир молчит. Выберите станцию.", keys: MAIN_KEYS };
    }
    return {
      text:
        channel === "telegram"
          ? `Сейчас: ${playing.name} · ${playing.city}\n${playing.blurb}\n\n${playing.stream}`
          : `Сейчас: ${playing.name} · ${playing.city}\n${playing.blurb}`,
      keys: MAIN_KEYS,
      stations: [playing],
    };
  }

  if (lower === "случайная" || lower === "/random") {
    const s = randomStation(playing?.id);
    return playReply(s, channel, true);
  }

  if (lower === "жанры" || lower === "/genres") {
    return {
      text: "Жанры. Нажмите кнопку или напишите название.",
      keys: [
        ...GENRES.map((g) => ({ id: `genre:${g.id}`, label: g.label })),
        ...MAIN_KEYS.filter((k) => k.id !== "genres"),
      ],
    };
  }

  if (lower === "все станции" || lower === "/stations") {
    return stationList(`Все станции · ${STATIONS.length}`, STATIONS);
  }

  const genre = GENRES.find(
    (g) => g.label.toLowerCase() === lower || g.id === lower,
  );
  if (genre) {
    const list = stationsByGenre(genre.id as GenreId);
    return stationList(`${genre.label} · ${list.length}`, list);
  }

  const found = findStations(text);
  if (found.length === 1) return playReply(found[0], channel);
  if (found.length > 1) return stationList(`Нашёл ${found.length}:`, found);

  return {
    text: "Не понял. Напишите название станции, жанр или нажмите кнопку внизу.",
    keys: MAIN_KEYS,
  };
}

function playReply(station: Station, channel: "web" | "telegram", random = false): BotReply {
  const lead = random ? `Случайная станция — ${station.name}.` : `Включаю «${station.name}».`;
  return {
    text:
      channel === "telegram"
        ? `${lead}\n${station.city} · ${genreLabel(station.genre)}\n${station.blurb}\n\nПрямой эфир:\n${station.stream}`
        : `${lead} ${station.blurb}`,
    keys: MAIN_KEYS,
    stations: [station],
    play: station,
  };
}

function stationList(title: string, list: Station[]): BotReply {
  if (list.length === 0) {
    return {
      text: `${title}\nНичего не нашёл. Попробуйте другое слово или откройте жанры.`,
      keys: MAIN_KEYS,
    };
  }
  return { text: title, stations: list, keys: MAIN_KEYS };
}
