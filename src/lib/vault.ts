import { DEFAULT_RULES, DEMO, type VoiceMode, type QuizCell } from "@/lib/pedagogy";

const KEY = "suqayr-db-v1";
const ITERATIONS = 80_000;

export type TrainNote = {
  id: string;
  at: number;
  topic: string;
  how: string;
  say: string;
  dialect: string;
  english: string;
};

export type StudentData = {
  quiz: Record<string, QuizCell>;
  draws: { t: number; l: string; u: string }[];
  chants: { t: number; x: string }[];
  photos: { t: number; l: string; u: string }[];
};

export type StudentRec = {
  salt: string;
  hash: string;
  created: number;
  data: StudentData;
};

export type Db = {
  sup: { name: string; salt: string; hash: string } | null;
  users: Record<string, StudentRec>;
  rules: string[];
  logs: { u: string; q: string; t: number }[];
  notes: TrainNote[];
  voice: VoiceMode;
  english: boolean;
  lesson: string;
};

export function emptyData(): StudentData {
  return { quiz: {}, draws: [], chants: [], photos: [] };
}

export function blankDb(): Db {
  return {
    sup: null,
    users: {},
    rules: [...DEFAULT_RULES],
    logs: [],
    notes: [],
    voice: "mix",
    english: true,
    lesson: "",
  };
}

export function randomSalt() {
  return [...crypto.getRandomValues(new Uint8Array(8))].map((value) => value.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string, salt: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return [...new Uint8Array(bits)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function letterArt(letter: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="255"><rect width="100%" height="100%" fill="#fffaf3"/><text x="170" y="175" text-anchor="middle" font-size="150" fill="#0f6e62" font-family="Tahoma,sans-serif">${letter}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function secret(password: string) {
  const salt = randomSalt();
  const hash = await hashPassword(password, salt);
  return { salt, hash };
}

export async function seedDb(): Promise<Db> {
  const [sup, nora, salem] = await Promise.all([
    secret(DEMO.sup.password),
    secret(DEMO.nora.password),
    secret(DEMO.salem.password),
  ]);
  const now = Date.now();
  return {
    sup: { name: DEMO.sup.name, ...sup },
    users: {
      [DEMO.nora.name]: {
        ...nora,
        created: now,
        data: {
          quiz: {
            ب: { ok: 1, err: 4 },
            ت: { ok: 3, err: 1 },
            ث: { ok: 0, err: 2 },
            "٦": { ok: 1, err: 3 },
            "٩": { ok: 1, err: 2 },
          },
          draws: [{ t: now - 86_000_000, l: "ب", u: letterArt("ب") }],
          chants: [{ t: now - 3_600_000, x: "الباء" }],
          photos: [],
        },
      },
      [DEMO.salem.name]: {
        ...salem,
        created: now,
        data: {
          quiz: {
            ب: { ok: 4, err: 1 },
            أ: { ok: 2, err: 0 },
            "٢": { ok: 3, err: 1 },
          },
          draws: [{ t: now - 172_000_000, l: "٢", u: letterArt("٢") }],
          chants: [{ t: now - 7_200_000, x: "رقم اثنين" }],
          photos: [],
        },
      },
    },
    rules: [...DEFAULT_RULES],
    logs: [{ u: DEMO.salem.name, q: "وين بيتكم؟", t: now - 5_000_000 }],
    notes: [
      {
        id: "note-ba",
        at: now - 4_000_000,
        topic: "ب",
        how: "قارب من الصلصال. نقطة واحدة تحت القارب. لا تشبّه الحرف بحيوان. فرّقها عن التاء التي نقطتها فوق.",
        say: "باء. قارب صغير، ونقطة واحدة تحته.",
        dialect: "زين، سوّها مع معلّمك.",
        english: "ba",
      },
      {
        id: "note-six",
        at: now - 3_000_000,
        topic: "٦",
        how: "عدّ ست تصفيقات. الذيل نازل. إذا طلع الذيل لفوق صارت تسعة.",
        say: "ستة. الذيل نازل لتحت.",
        dialect: "يلا نعدّ ستّة.",
        english: "six",
      },
    ],
    voice: "mix",
    english: true,
    lesson: "اليوم نفرّق الباء عن التاء: النقطة تحت أو فوق. والستة ذيلها نازل.",
  };
}

export function loadDb(): Db | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Db;
    if (!parsed || typeof parsed !== "object" || !parsed.users) return null;
    parsed.rules = parsed.rules?.length ? parsed.rules : [...DEFAULT_RULES];
    parsed.notes = parsed.notes ?? [];
    parsed.logs = parsed.logs ?? [];
    parsed.voice = parsed.voice ?? "mix";
    parsed.english = parsed.english ?? true;
    parsed.lesson = parsed.lesson ?? "";
    return parsed;
  } catch {
    return null;
  }
}

export function saveDb(db: Db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function clearDb() {
  localStorage.removeItem(KEY);
}
