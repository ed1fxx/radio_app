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
    id: "europa",
    name: "Европа Плюс",
    city: "Москва",
    genre: "pop",
    stream: "https://ep128.hostingradio.ru:8030/ep128",
    blurb: "Хиты и свежий поп без перерыва.",
  },
  {
    id: "rusradio",
    name: "Русское Радио",
    city: "Москва",
    genre: "pop",
    stream: "https://rusradio.hostingradio.ru/rusradio128.mp3",
    blurb: "Русская поп-сцена и знакомые голоса.",
  },
  {
    id: "maximum",
    name: "Maximum",
    city: "Москва",
    genre: "rock",
    stream: "https://maximum.hostingradio.ru/maximum128.mp3",
    blurb: "Рок и альтернатива, громко и по делу.",
  },
  {
    id: "nashe",
    name: "Наше Радио",
    city: "Москва",
    genre: "rock",
    stream: "https://nashe1.hostingradio.ru/nashe-128.mp3",
    blurb: "Русский рок с 101.8 FM.",
  },
  {
    id: "dfm",
    name: "DFM",
    city: "Москва",
    genre: "electronic",
    stream: "https://dfm.hostingradio.ru/dfm128.mp3",
    blurb: "Клубные миксы и танцевальные хиты.",
  },
  {
    id: "record",
    name: "Radio Record",
    city: "Санкт-Петербург",
    genre: "electronic",
    stream: "https://radiorecord.hostingradio.ru/rr_main96.aacp",
    blurb: "Главный канал Record: EDM и ночные сеты.",
  },
  {
    id: "montecarlo",
    name: "Монте-Карло",
    city: "Москва",
    genre: "chill",
    stream: "https://montecarlo.hostingradio.ru/montecarlo128.mp3",
    blurb: "Лёгкий гламур и мягкий вечерний эфир.",
  },
  {
    id: "silver",
    name: "Серебряный Дождь",
    city: "Москва",
    genre: "world",
    stream: "https://silverrain.hostingradio.ru/silver128.mp3",
    blurb: "Городской эфир, разговоры и независимая музыка.",
  },
  {
    id: "chanson",
    name: "Радио Шансон",
    city: "Москва",
    genre: "pop",
    stream: "https://chanson.hostingradio.ru:8041/chanson128.mp3",
    blurb: "Шансон и городской романс.",
  },
  {
    id: "dorozhnoe",
    name: "Дорожное радио",
    city: "Санкт-Петербург",
    genre: "pop",
    stream: "https://dorognoe.hostingradio.ru:8000/radio",
    blurb: "Для трассы: хиты, погода и километры.",
  },
  {
    id: "mayak",
    name: "Маяк",
    city: "Москва",
    genre: "news",
    stream: "https://icecast-vgtrk.cdnvideo.ru/mayakfm_mp3_192kbps",
    blurb: "Новости, разговоры и дневной эфир ВГТРК.",
  },
  {
    id: "orpheus",
    name: "Орфей",
    city: "Москва",
    genre: "classical",
    stream: "https://orfeyfm.hostingradio.ru:8034/orfeyfm192.mp3",
    blurb: "Классика, опера и камерные концерты.",
  },
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
