export const GENRES = [
  { id: "pop", label: "Поп" },
  { id: "rock", label: "Рок" },
  { id: "electronic", label: "Электроника" },
  { id: "chill", label: "Релакс" },
  { id: "classical", label: "Классика" },
  { id: "news", label: "Новости" },
  { id: "world", label: "Мир" },
] as const;

export type GenreId = (typeof GENRES)[number]["id"];

export type Station = {
  id: string;
  name: string;
  city: string;
  genre: GenreId;
  stream: string;
  blurb: string;
};

export const STATIONS: Station[] = [
  {
    id: "paradise",
    name: "Radio Paradise",
    city: "Калифорния",
    genre: "world",
    stream: "https://stream.radioparadise.com/aac-128",
    blurb: "Экклектика без рекламы: рок, электроника, world.",
  },
  {
    id: "fip",
    name: "FIP",
    city: "Париж",
    genre: "world",
    stream: "https://icecast.radiofrance.fr/fip-midfi.mp3",
    blurb: "Радио France: джаз, соул, электроника и сюрпризы.",
  },
  {
    id: "francemusique",
    name: "France Musique",
    city: "Париж",
    genre: "classical",
    stream: "https://icecast.radiofrance.fr/francemusique-midfi.mp3",
    blurb: "Классика и современная академическая сцена.",
  },
  {
    id: "brklassik",
    name: "BR-Klassik",
    city: "Мюнхен",
    genre: "classical",
    stream: "https://dispatcher.rndfnk.com/br/brklassik/live/mp3/mid",
    blurb: "Баварская классика в прямом эфире.",
  },
  {
    id: "bayern3",
    name: "Bayern 3",
    city: "Мюнхен",
    genre: "pop",
    stream: "https://dispatcher.rndfnk.com/br/br3/live/mp3/mid",
    blurb: "Немецкий поп и драйв Bayern 3.",
  },
  {
    id: "kexp",
    name: "KEXP",
    city: "Сиэтл",
    genre: "rock",
    stream: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
    blurb: "Живые сессии и независимый рок.",
  },
  {
    id: "fm4",
    name: "FM4",
    city: "Вена",
    genre: "rock",
    stream: "https://orf-live.ors-shoutcast.at/fm4-q2a",
    blurb: "Альтернатива ORF: инди, электроника, разговор.",
  },
  {
    id: "wbez",
    name: "WBEZ",
    city: "Чикаго",
    genre: "news",
    stream: "https://stream.wbez.org/wbez128.mp3",
    blurb: "Публичное радио: новости и подкасты NPR.",
  },
  {
    id: "groovesalad",
    name: "SomaFM Groove Salad",
    city: "Сан-Франциско",
    genre: "chill",
    stream: "https://ice1.somafm.com/groovesalad-128-mp3",
    blurb: "Даунтемпо и эмбиент без рекламы.",
  },
  {
    id: "dronezone",
    name: "SomaFM Drone Zone",
    city: "Сан-Франциско",
    genre: "chill",
    stream: "https://ice4.somafm.com/dronezone-128-mp3",
    blurb: "Длинные атмосферные полотна.",
  },
  {
    id: "secretagent",
    name: "SomaFM Secret Agent",
    city: "Сан-Франциско",
    genre: "chill",
    stream: "https://ice2.somafm.com/secretagent-128-mp3",
    blurb: "Шпионский лаунж и коктейльный джаз.",
  },
  {
    id: "indiepop",
    name: "SomaFM Indie Pop Rocks",
    city: "Сан-Франциско",
    genre: "rock",
    stream: "https://ice6.somafm.com/indiepop-128-mp3",
    blurb: "Инди-поп, гитары и хуки.",
  },
  {
    id: "spacestation",
    name: "SomaFM Space Station Soma",
    city: "Сан-Франциско",
    genre: "electronic",
    stream: "https://ice1.somafm.com/spacestation-128-mp3",
    blurb: "Космический транс и прогрессив.",
  },
  {
    id: "thetrip",
    name: "SomaFM The Trip",
    city: "Сан-Франциско",
    genre: "electronic",
    stream: "https://ice1.somafm.com/thetrip-128-mp3",
    blurb: "Прогрессивный транс без болтовни.",
  },
  {
    id: "franceinter",
    name: "France Inter",
    city: "Париж",
    genre: "news",
    stream: "https://icecast.radiofrance.fr/franceinter-midfi.mp3",
    blurb: "Французский разговорный эфир и культура.",
  },
];

export function genreLabel(id: GenreId) {
  return GENRES.find((g) => g.id === id)?.label ?? id;
}

export function stationsByGenre(id: GenreId) {
  return STATIONS.filter((s) => s.genre === id);
}

export function findStations(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      genreLabel(s.genre).toLowerCase().includes(q),
  );
}

export function randomStation(exceptId?: string) {
  const pool = exceptId ? STATIONS.filter((s) => s.id !== exceptId) : STATIONS;
  return pool[Math.floor(Math.random() * pool.length)] ?? STATIONS[0];
}
