export const REFUSAL = "اسأل معلّمك، ليس من حقي الإجابة عن ذلك";

export const DEFAULT_RULES = [
  "العنف والأسلحة والدم",
  "المحتوى الجنسي والعلاقات العاطفية",
  "المخدرات والتدخين والكحول",
  "السياسة والخلافات بين الدول",
  "النقاش في الأديان والمذاهب",
  "السحر والخرافات المخيفة",
  "أي موضوع مخيف أو مؤذٍ للأطفال",
  "طلب معلومات شخصية أو عنوان أو هاتف",
  "كل ما يخالف قيم المجتمع الكويتي وتعليم الأطفال",
];

export type VoiceMode = "fusha" | "mix" | "kuwaiti";

export type Glyph = {
  id: string;
  kind: "letter" | "digit";
  name: string;
  en: string;
  confuses: string;
  shape: string;
  material: string;
  steps: string[];
  child: string;
  dialect: string;
  air: string;
};

const MATERIALS = [
  "صلصال",
  "رمل على صينية",
  "عيدان خشبية",
  "حبات فاكهة",
  "دقيق على صينية",
  "أرز على صينية",
] as const;

type LetterRow = {
  id: string;
  name: string;
  en: string;
  confuses: string;
  shape: string;
  where: string;
  count: 0 | 1 | 2 | 3;
};

const LETTERS: LetterRow[] = [
  { id: "أ", name: "ألف", en: "alif", confuses: "اللام إذا طالت العصا", shape: "عصا نازلة من فوق لتحت", where: "", count: 0 },
  { id: "ب", name: "باء", en: "ba", confuses: "التاء والثاء", shape: "قارب صغير", where: "تحت القارب", count: 1 },
  { id: "ت", name: "تاء", en: "ta", confuses: "الباء والثاء", shape: "قارب صغير", where: "فوق القارب", count: 2 },
  { id: "ث", name: "ثاء", en: "tha", confuses: "الباء والتاء", shape: "قارب صغير", where: "فوق القارب", count: 3 },
  { id: "ج", name: "جيم", en: "jeem", confuses: "الحاء والخاء", shape: "حلقة مفتوحة", where: "في بطن الحلقة", count: 1 },
  { id: "ح", name: "حاء", en: "ha", confuses: "الجيم والخاء", shape: "حلقة مفتوحة", where: "", count: 0 },
  { id: "خ", name: "خاء", en: "kha", confuses: "الجيم والحاء", shape: "حلقة مفتوحة", where: "فوق الحلقة", count: 1 },
  { id: "د", name: "دال", en: "dal", confuses: "الذال", shape: "ظهر صغير", where: "", count: 0 },
  { id: "ذ", name: "ذال", en: "dhal", confuses: "الدال", shape: "ظهر صغير", where: "فوق الظهر", count: 1 },
  { id: "ر", name: "راء", en: "ra", confuses: "الزاي", shape: "قوس واقف", where: "", count: 0 },
  { id: "ز", name: "زاي", en: "zay", confuses: "الراء", shape: "قوس واقف", where: "فوق القوس", count: 1 },
  { id: "س", name: "سين", en: "seen", confuses: "الشين", shape: "ثلاثة أسنان", where: "", count: 0 },
  { id: "ش", name: "شين", en: "sheen", confuses: "السين", shape: "ثلاثة أسنان", where: "فوق الأسنان", count: 3 },
  { id: "ص", name: "صاد", en: "sad", confuses: "الضاد", shape: "حلقة مغلقة", where: "", count: 0 },
  { id: "ض", name: "ضاد", en: "dad", confuses: "الصاد", shape: "حلقة مغلقة", where: "فوق الحلقة", count: 1 },
  { id: "ط", name: "طاء", en: "tah", confuses: "الظاء", shape: "صحن وعصا", where: "", count: 0 },
  { id: "ظ", name: "ظاء", en: "zah", confuses: "الطاء", shape: "صحن وعصا", where: "فوق الصحن", count: 1 },
  { id: "ع", name: "عين", en: "ain", confuses: "الغين", shape: "فم مفتوح", where: "", count: 0 },
  { id: "غ", name: "غين", en: "ghain", confuses: "العين", shape: "فم مفتوح", where: "فوق الفتحة", count: 1 },
  { id: "ف", name: "فاء", en: "fa", confuses: "القاف", shape: "حلقة وذراع", where: "فوق الحلقة", count: 1 },
  { id: "ق", name: "قاف", en: "qaf", confuses: "الفاء", shape: "حلقة عميقة وذراع", where: "فوق الحلقة", count: 2 },
  { id: "ك", name: "كاف", en: "kaf", confuses: "لا نقطة، راقب فتحة الكف", shape: "كف مفتوحة", where: "", count: 0 },
  { id: "ل", name: "لام", en: "lam", confuses: "الألف", shape: "عصا طويلة بقاعدة", where: "", count: 0 },
  { id: "م", name: "ميم", en: "meem", confuses: "الهاء", shape: "دائرة مغلقة", where: "", count: 0 },
  { id: "ن", name: "نون", en: "noon", confuses: "الباء والياء في موضع النقطة", shape: "قوس", where: "فوق القوس", count: 1 },
  { id: "ه", name: "هاء", en: "ha", confuses: "الميم", shape: "دائرة صغيرة", where: "", count: 0 },
  { id: "و", name: "واو", en: "waw", confuses: "الراء", shape: "دائرة وذيل قصير", where: "", count: 0 },
  { id: "ي", name: "ياء", en: "ya", confuses: "التاء لأن نقاط التاء فوق", shape: "قوس", where: "تحت القوس", count: 2 },
];

function dotPhrase(count: number, where: string) {
  const n = count === 1 ? "نقطة واحدة" : count === 2 ? "نقطتين" : "ثلاث نقاط";
  return `ضع ${n} ${where}.`;
}

function buildLetter(row: LetterRow, index: number): Glyph {
  const material = MATERIALS[index % MATERIALS.length] ?? "صلصال";
  const dotted = row.count > 0;
  const steps = [
    `أحضر ${material}. اصنع «${row.shape}» وأنت تقول: ${row.name}.`,
    dotted
      ? `${dotPhrase(row.count, row.where)} قل: ${row.name}. يختلط مع ${row.confuses}.`
      : `أكّد: ${row.name} بلا نقاط. يختلط مع ${row.confuses}.`,
    "يغمض الطفل عينيه ويلمس الشكل، ثم يفتحهما ويعيده بيده.",
    `صفّقوا ببطء وردّدوا ثلاث مرات: ${row.name}.`,
  ];
  const child = dotted
    ? `${row.name}. ${dotPhrase(row.count, row.where)}`
    : `${row.name}. شكله ${row.shape}. بلا نقاط.`;
  return {
    id: row.id,
    kind: "letter",
    name: row.name,
    en: row.en,
    confuses: row.confuses,
    shape: row.shape,
    material,
    steps,
    child,
    dialect: "زين. تقدر تعيدها مع معلّمك.",
    air: `ارسم في الهواء: ${row.shape}.`,
  };
}

type DigitRow = { id: string; name: string; en: string; confuses: string; hint: string };

const DIGITS: DigitRow[] = [
  { id: "٠", name: "صفر", en: "zero", confuses: "الخمسة", hint: "صفر دائرة فارغة بلا عصا. الخمسة فيها قاعدة." },
  { id: "١", name: "واحد", en: "one", confuses: "الألف إن رُسم عصًا", hint: "واحد عصا قصيرة. عدّوا شيئًا واحدًا." },
  { id: "٢", name: "اثنان", en: "two", confuses: "الثلاثة", hint: "اثنان قوسان فوق بعض. الثلاثة ثلاثة أقواس." },
  { id: "٣", name: "ثلاثة", en: "three", confuses: "الاثنان", hint: "ثلاثة ثلاثة أقواس. أكثر من اثنين بقوس." },
  { id: "٤", name: "أربعة", en: "four", confuses: "السبعة أحيانًا", hint: "أربعة زاوية مغلقة ثم عصا." },
  { id: "٥", name: "خمسة", en: "five", confuses: "الصفر", hint: "خمسة دائرة ثم قاعدة. الصفر دائرة وحدها." },
  { id: "٦", name: "ستة", en: "six", confuses: "التسعة", hint: "ستة ذيلها نازل لتحت. إذا صعد الذيل صارت تسعة." },
  { id: "٧", name: "سبعة", en: "seven", confuses: "الواحد", hint: "سبعة عصا ثم خط مائل." },
  { id: "٨", name: "ثمانية", en: "eight", confuses: "الصفر إن انفصلت الدائرتان", hint: "ثمانية دائرتان فوق بعض." },
  { id: "٩", name: "تسعة", en: "nine", confuses: "الستة", hint: "تسعة ذيلها طالع لفوق. إذا نزل الذيل صارت ستة." },
];

function buildDigit(row: DigitRow, index: number): Glyph {
  const material = MATERIALS[(index + 3) % MATERIALS.length] ?? "رمل على صينية";
  return {
    id: row.id,
    kind: "digit",
    name: row.name,
    en: row.en,
    confuses: row.confuses,
    shape: row.hint,
    material,
    steps: [
      `ضع أشياء على الطاولة بعدد «${row.name}» وعدّوها بالتصفيق.`,
      row.hint,
      `اكتب ${row.id} بالإصبع على ${material}. امسحه وأعده.`,
      "قل الرقم. الطفل يرسمه وعيناه مغمضتان ثم يفتح ليتأكد.",
    ],
    child: `${row.name}. ${row.hint}`,
    dialect: "يلا نعدّها مع بعض.",
    air: `ارسم الرقم ${row.id} في الهواء.`,
  };
}

export const GLYPHS: Glyph[] = [
  ...LETTERS.map(buildLetter),
  ...DIGITS.map(buildDigit),
];

export const INITIAL: Record<string, string> = {
  ب: "بـ",
  ت: "تـ",
  ث: "ثـ",
  ج: "جـ",
  ح: "حـ",
  خ: "خـ",
  س: "سـ",
  ش: "شـ",
  ص: "صـ",
  ض: "ضـ",
  ط: "طـ",
  ظ: "ظـ",
  ع: "عـ",
  غ: "غـ",
  ف: "فـ",
  ق: "قـ",
  ن: "نـ",
  ي: "يـ",
};

export const FAMILIES = [
  ["ب", "ت", "ث"],
  ["ج", "ح", "خ"],
  ["س", "ش"],
  ["ص", "ض"],
  ["ط", "ظ"],
  ["ع", "غ"],
  ["ف", "ق"],
  ["ن", "ي"],
];

export const WORDS = ["باب", "تين", "شمس", "سمك", "خبز", "ورد", "نجم", "قمر", "بيت", "ولد", "قلم", "أمل"];

export const DEMO = {
  sup: { name: "كوثر", password: "najm2026" },
  nora: { name: "نورة", password: "nora2026" },
  salem: { name: "سالم", password: "salem2026" },
};

export function canon(char: string) {
  if (char === "ا" || char === "أ" || char === "إ" || char === "آ") return "أ";
  if (char === "ى") return "ي";
  if (char === "ة") return "ه";
  return char;
}

export function glyphOf(id: string) {
  const key = canon(id);
  return GLYPHS.find((glyph) => glyph.id === key);
}

export function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = swap as T;
  }
  return copy;
}

export type QuizCell = { ok: number; err: number };

export function accuracy(quiz: Record<string, QuizCell>) {
  let ok = 0;
  let err = 0;
  for (const cell of Object.values(quiz)) {
    ok += cell.ok;
    err += cell.err;
  }
  if (ok + err === 0) return null;
  return Math.round((100 * ok) / (ok + err));
}

export function attempts(quiz: Record<string, QuizCell>) {
  let n = 0;
  for (const cell of Object.values(quiz)) n += cell.ok + cell.err;
  return n;
}

export function ranked(quiz: Record<string, QuizCell>) {
  return Object.entries(quiz)
    .map(([id, cell]) => ({
      id,
      ok: cell.ok,
      err: cell.err,
      total: cell.ok + cell.err,
    }))
    .sort((a, b) => b.err - a.err || a.ok - b.ok);
}

export function teacherReply(
  question: string,
  notes: { topic: string; say: string; dialect: string; english?: string }[],
  voice: VoiceMode,
  english = false,
) {
  const note = [...notes].reverse().find((item) => item.say && topicHit(question, item.topic));
  if (note) return voiced(note.say, note.dialect, voice, english, note.english ?? "");
  const glyph = GLYPHS.find((item) => question.includes(item.id) || question.includes(item.name));
  if (glyph) return voiced(`${glyph.child} معلّمك يريك الطريقة بيده.`, glyph.dialect, voice, english, glyph.en);
  return voice === "kuwaiti"
    ? "سؤال حلو. اسأل معلّمك، أو قل لي حرفًا نلعبه بالصلصال."
    : "سؤال جميل. اسأل معلّمك، أو قل لي حرفًا أو رقمًا لنتعلّمه بالحركة.";
}

export function localChant(topic: string) {
  return [
    `${topic}، نلمسها بيدنا`,
    "نردّدها ونصفّق",
    "معلّمي علّمني",
    "وأنا أقدر أتقدّم",
  ];
}

function topicHit(question: string, topic: string) {
  if (!topic) return false;
  if (question.includes(topic)) return true;
  const glyph = glyphOf(topic);
  if (!glyph) return false;
  return question.includes(glyph.name) || question.toLowerCase().includes(glyph.en.toLowerCase());
}

function voiced(say: string, dialect: string, voice: VoiceMode, english: boolean, en: string) {
  const line = voice === "fusha" ? say : `${say} ${dialect || "زين. اسأل معلّمك."}`.trim();
  if (!english || !en || line.toLowerCase().includes(en.toLowerCase())) return line;
  return `${line} ${en}.`;
}
