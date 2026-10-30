import { useEffect, useRef, useState } from "react";
import { Mic, Pencil, Star, Volume2 } from "lucide-react";
import { askBird, composeChant } from "@/lib/grok.functions";
import { useRoom } from "@/lib/classroom";
import { hashPassword } from "@/lib/vault";
import {
  GLYPHS,
  INITIAL,
  WORDS,
  accuracy,
  glyphOf,
  ranked,
  shuffle,
  teacherReply,
} from "@/lib/pedagogy";
import { clap, listen, setVoiceEnabled, speak, voiceEnabled } from "@/lib/speech";
import { Falcon, Meter, TopBar, card, clay, gulf, paper, sourceLabel } from "@/components/bits";

type Tab = "talk" | "chant" | "trace" | "play" | "stars";
type Msg = { role: "child" | "bird"; text: string; source?: string };
type Tile = { l: string; used: boolean };
type Block = { word: string; placed: string; pool: Tile[]; done: boolean };
type Face = { id: string; letter: string; shown: string; kind: "full" | "form"; open: boolean; done: boolean };
type NumRound = { answer: string; options: string[]; n: number };

const TABS: { id: Tab; label: string }[] = [
  { id: "talk", label: "كلّم صُقَيْر" },
  { id: "chant", label: "أنشودة" },
  { id: "trace", label: "أرسم" },
  { id: "play", label: "ألعب" },
  { id: "stars", label: "نجومي" },
];

const NUMS: NumRound[] = [
  { n: 6, answer: "٦", options: ["٦", "٩", "٥"] },
  { n: 9, answer: "٩", options: ["٩", "٦", "٨"] },
  { n: 2, answer: "٢", options: ["٢", "٣", "٥"] },
  { n: 3, answer: "٣", options: ["٣", "٢", "٨"] },
  { n: 5, answer: "٥", options: ["٥", "٠", "٨"] },
  { n: 8, answer: "٨", options: ["٨", "٠", "٣"] },
];

const PENS = [
  { id: "ink", label: "حبر", token: "--color-ink" },
  { id: "gulf", label: "أخضر", token: "--color-gulf" },
  { id: "clay", label: "طين", token: "--color-clay" },
] as const;

function newBlock(): Block {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)] ?? "نجم";
  return {
    word,
    placed: "",
    pool: shuffle([...word].map((l) => ({ l, used: false }))),
    done: false,
  };
}

function deal(): Face[] {
  const letters = shuffle(Object.keys(INITIAL)).slice(0, 3);
  return shuffle(
    letters.flatMap((letter) => [
      { id: `${letter}-a`, letter, shown: letter, kind: "full" as const, open: false, done: false },
      { id: `${letter}-b`, letter, shown: INITIAL[letter] ?? letter, kind: "form" as const, open: false, done: false },
    ]),
  );
}

export function StudentView() {
  const me = useRoom((state) => state.me);
  const db = useRoom((state) => state.db);
  const [tab, setTab] = useState<Tab>("talk");
  const [heard, setHeard] = useState(voiceEnabled());
  const name = me?.name ?? "";
  const user = db.users[name];

  function toggleVoice() {
    const next = !voiceEnabled();
    setVoiceEnabled(next);
    setHeard(next);
    if (next) void speak("الصوت يعمل");
  }

  if (!user) return null;

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-4">
      <TopBar title={`أهلًا ${name}`} heard={heard} onHear={toggleVoice} />
      <div className="mb-3 flex items-center gap-3">
        <Falcon className="h-20 w-16" />
        <p className="text-mist">أنا صُقَيْر. معلّمك علّمني. اسألني، أو المس الحرف بإصبعك.</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? clay : paper} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {tab === "talk" ? <Talk name={name} /> : null}
      {tab === "chant" ? <Chant name={name} /> : null}
      {tab === "trace" ? <Trace name={name} /> : null}
      {tab === "play" ? <Play name={name} /> : null}
      {tab === "stars" ? <Stars name={name} /> : null}
    </div>
  );
}

function notesOf(db: ReturnType<typeof useRoom.getState>["db"]) {
  return db.notes.slice(-8).map(({ topic, how, say, dialect, english }) => ({ topic, how, say, dialect, english }));
}

function Talk({ name }: { name: string }) {
  const db = useRoom((state) => state.db);
  const addLog = useRoom((state) => state.addLog);
  const notify = useRoom((state) => state.notify);
  const [chat, setChat] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const data = db.users[name]?.data;

  async function send(raw: string) {
    const question = raw.trim();
    if (!question || busy || !data) return;
    const history = chat.slice(-6).map((item) => ({ role: item.role, text: item.text }));
    const weak = ranked(data.quiz)
      .filter((item) => item.err > 0)
      .slice(0, 6)
      .map((item) => item.id);
    setChat((items) => [...items, { role: "child", text: question }]);
    setText("");
    setBusy(true);
    try {
      const result = await askBird({
        data: {
          question,
          history,
          rules: db.rules,
          notes: notesOf(db),
          weak,
          lesson: db.lesson,
          voice: db.voice,
          english: db.english,
          child: name,
        },
      });
      setChat((items) => [...items, { role: "bird", text: result.text, source: result.source }]);
      if (result.refused) addLog(name, question);
      void speak(result.text);
    } catch {
      const line = teacherReply(question, notesOf(db), db.voice, db.english);
      setChat((items) => [...items, { role: "bird", text: line, source: "offline" }]);
      void speak(line);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={`${card} grid gap-3`}>
      <div className="rounded-2xl bg-sand p-3">
        أهلًا {name}. أنا صُقَيْر. ماذا نتعلّم اليوم؟
        <button type="button" className={`${paper} mt-2`} onClick={() => void speak(`أهلًا ${name}. أنا صقير. ماذا نتعلم اليوم؟`)}>
          <Volume2 className="h-5 w-5" />
          اسمع
        </button>
      </div>
      {chat.map((item, index) => (
        <div key={`${item.role}-${index}`} className={item.role === "child" ? "me-auto w-11/12 rounded-2xl bg-gulf p-3 text-gulf-ink" : "ms-auto w-11/12 rounded-2xl border-2 border-line bg-sand p-3"}>
          <p>{item.text}</p>
          {item.source ? <p className="mt-1 text-sm text-mist">{sourceLabel(item.source)}</p> : null}
        </div>
      ))}
      {busy ? <p className="text-mist">صُقَيْر يفكّر…</p> : null}
      <button
        type="button"
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-clay text-clay-ink"
        onClick={() => {
          notify("تكلّم الآن");
          listen(
            (heard) => void send(heard),
            () => notify("لم أسمع. اكتب السؤال تحت."),
          );
        }}
      >
        <Mic className="h-8 w-8" />
        <span className="sr-only">تكلّم</span>
      </button>
      <form
        className="grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send(text);
        }}
      >
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="أو اكتب، وهذا للأهل" />
        <button className={gulf} type="submit" disabled={busy}>
          إرسال
        </button>
      </form>
    </section>
  );
}

function Chant({ name }: { name: string }) {
  const db = useRoom((state) => state.db);
  const addLog = useRoom((state) => state.addLog);
  const saveChant = useRoom((state) => state.saveChant);
  const notify = useRoom((state) => state.notify);
  const [topic, setTopic] = useState("الباء");
  const [lines, setLines] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const data = db.users[name]?.data;

  async function make(raw: string) {
    const question = raw.trim();
    if (question.length < 2 || busy || !data) return;
    setBusy(true);
    setLines([]);
    const weak = ranked(data.quiz)
      .filter((item) => item.err > 0)
      .slice(0, 6)
      .map((item) => item.id);
    try {
      const result = await composeChant({
        data: {
          question,
          history: [],
          rules: db.rules,
          notes: notesOf(db),
          weak,
          lesson: db.lesson,
          voice: db.voice,
          english: false,
          child: name,
        },
      });
      setLines(result.lines);
      setSource(result.source);
      if (result.refused) addLog(name, question);
      else saveChant(name, question);
      void play(result.lines);
    } catch {
      notify("تعذّر التأليف. جرّب مرة أخرى");
    } finally {
      setBusy(false);
    }
  }

  async function play(rows: string[]) {
    for (const line of rows) {
      clap(1);
      await speak(line);
    }
  }

  return (
    <section className="grid gap-3">
      <div className={card}>
        <h2 className="mb-2 text-2xl font-bold">ما الذي يصعب عليك؟</h2>
        <input value={topic} onChange={(event) => setTopic(event.target.value)} />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className={clay}
            onClick={() => {
              notify("تكلّم الآن");
              listen(
                (heard) => {
                  setTopic(heard);
                  void make(heard);
                },
                () => notify("لم أسمع. اكتب ما يصعب."),
              );
            }}
          >
            <Mic className="h-5 w-5" />
            تكلّم
          </button>
          <button type="button" className={gulf} disabled={busy} onClick={() => void make(topic)}>
            {busy ? "أؤلّف…" : "ألّف أنشودة"}
          </button>
        </div>
      </div>
      {lines.length ? (
        <div className={`${card} grid gap-2`}>
          <Falcon className="h-24 w-20" />
          {lines.map((line) => (
            <p key={line} className="text-2xl">
              {line}
            </p>
          ))}
          <button type="button" className={paper} onClick={() => void play(lines)}>
            صفّق وردّد
          </button>
          {source ? <p className="text-sm text-mist">{sourceLabel(source)}</p> : null}
          <p className="text-mist">ردّدها مع التصفيق. بلا موسيقى.</p>
        </div>
      ) : null}
    </section>
  );
}

function Trace({ name }: { name: string }) {
  const saveDraw = useRoom((state) => state.saveDraw);
  const notify = useRoom((state) => state.notify);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const penRef = useRef("ink");
  const [glyphId, setGlyphId] = useState("ب");
  const [pen, setPen] = useState<(typeof PENS)[number]["id"]>("ink");
  const glyph = glyphOf(glyphId);
  const idea = glyph ? `لنحضر ${glyph.material} ونرسم «${glyph.name}». ${glyph.air}` : "";

  useEffect(() => {
    penRef.current = pen;
  }, [pen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paintBoard(ctx, glyphId);
    let drawing = false;
    const point = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return [(event.clientX - rect.left) * 340 / rect.width, (event.clientY - rect.top) * 255 / rect.height];
    };
    const color = () => getComputedStyle(document.documentElement).getPropertyValue(PENS.find((item) => item.id === penRef.current)?.token ?? "--color-ink").trim();
    const down = (event: PointerEvent) => {
      drawing = true;
      const [x, y] = point(event);
      ctx.strokeStyle = color();
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x ?? 0, y ?? 0);
      canvas.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!drawing) return;
      const [x, y] = point(event);
      ctx.lineTo(x ?? 0, y ?? 0);
      ctx.stroke();
    };
    const up = () => {
      drawing = false;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [glyphId]);

  return (
    <section className="grid gap-3">
      <div className={card}>
        <h2 className="mb-2 text-2xl font-bold">اختر حرفًا أو رقمًا</h2>
        <div className="flex flex-wrap gap-2">
          {GLYPHS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${item.id === glyphId ? clay : paper} min-w-11 px-3 text-2xl`}
              onClick={() => {
                setGlyphId(item.id);
                void speak(item.name);
              }}
            >
              {item.id}
            </button>
          ))}
        </div>
      </div>
      <div className={card}>
        <p className="mb-2 font-semibold">{idea}</p>
        <canvas
          ref={canvasRef}
          width={340}
          height={255}
          className="aspect-[4/3] w-full max-w-sm touch-none rounded-card border-2 border-line bg-paper"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {PENS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={pen === item.id}
              className={`h-11 w-11 rounded-full border-2 ${pen === item.id ? "border-ink" : "border-line"} ${item.id === "ink" ? "bg-ink" : item.id === "gulf" ? "bg-gulf" : "bg-clay"}`}
              onClick={() => setPen(item.id)}
            />
          ))}
          <button
            type="button"
            className={paper}
            onClick={() => {
              const ctx = canvasRef.current?.getContext("2d");
              if (ctx) paintBoard(ctx, glyphId);
            }}
          >
            مسح
          </button>
          <button
            type="button"
            className={gulf}
            onClick={() => {
              const url = canvasRef.current?.toDataURL("image/jpeg", 0.55);
              if (!url) return;
              saveDraw(name, glyphId, url);
              notify("حُفظت رسمتك في معرض النجوم");
            }}
          >
            <Pencil className="h-5 w-5" />
            حفظ
          </button>
          <button type="button" className={paper} onClick={() => void speak(glyph?.name ?? glyphId)}>
            <Volume2 className="h-5 w-5" />
            اسمه
          </button>
        </div>
      </div>
    </section>
  );
}

function paintBoard(ctx: CanvasRenderingContext2D, glyphId: string) {
  ctx.fillStyle = "#fffaf3";
  ctx.fillRect(0, 0, 340, 255);
  ctx.fillStyle = "rgba(15, 110, 98, 0.2)";
  ctx.font = "bold 180px Tahoma, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyphId, 170, 132);
}

function Play({ name }: { name: string }) {
  const [mode, setMode] = useState<"word" | "num" | "form">("word");
  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={mode === "word" ? clay : paper} onClick={() => setMode("word")}>
          مكعبات الكلمة
        </button>
        <button type="button" className={mode === "num" ? clay : paper} onClick={() => setMode("num")}>
          عدّ النقاط
        </button>
        <button type="button" className={mode === "form" ? clay : paper} onClick={() => setMode("form")}>
          شكل الحرف
        </button>
      </div>
      {mode === "word" ? <WordGame name={name} /> : null}
      {mode === "num" ? <NumGame name={name} /> : null}
      {mode === "form" ? <FormGame name={name} /> : null}
    </section>
  );
}

function WordGame({ name }: { name: string }) {
  const record = useRoom((state) => state.record);
  const notify = useRoom((state) => state.notify);
  const [block, setBlock] = useState<Block>(newBlock);

  function pick(index: number) {
    const tile = block.pool[index];
    if (!tile || tile.used || block.done) return;
    const need = [...block.word][block.placed.length] ?? "";
    if (tile.l !== need) {
      record(name, need, false);
      notify("جرّب حرفًا آخر");
      void speak("جرّب حرفًا آخر");
      return;
    }
    const placed = block.placed + tile.l;
    const done = placed === block.word;
    setBlock({
      ...block,
      placed,
      done,
      pool: block.pool.map((item, i) => (i === index ? { ...item, used: true } : item)),
    });
    record(name, tile.l, true);
    void speak(done ? block.word : tile.l);
  }

  return (
    <div className={`${card} text-center`}>
      <h2 className="mb-2 text-2xl font-bold">اسمع ثم رتّب</h2>
      <button type="button" className={gulf} onClick={() => void speak(block.word)}>
        <Volume2 className="h-5 w-5" />
        اسمع الكلمة
      </button>
      <div className="my-4 flex flex-wrap justify-center gap-2">
        {[...block.word].map((letter, index) => (
          <span key={`${letter}-${index}`} className="inline-flex h-16 w-14 items-center justify-center border-b-4 border-clay text-4xl">
            {block.placed[index] ?? ""}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {block.pool.map((tile, index) => (
          <button key={`${tile.l}-${index}`} type="button" className={`${tile.used ? paper : gulf} min-w-14 text-3xl`} disabled={tile.used} onClick={() => pick(index)}>
            {tile.l}
          </button>
        ))}
      </div>
      {block.done ? (
        <button type="button" className={`${paper} mt-4`} onClick={() => setBlock(newBlock())}>
          كلمة جديدة
        </button>
      ) : null}
    </div>
  );
}

function NumGame({ name }: { name: string }) {
  const record = useRoom((state) => state.record);
  const [round, setRound] = useState<NumRound>(NUMS[0] ?? { n: 6, answer: "٦", options: ["٦", "٩", "٥"] });
  const [note, setNote] = useState("");

  useEffect(() => {
    void speak(glyphOf(round.answer)?.name ?? "");
  }, [round]);

  return (
    <div className={`${card} text-center`}>
      <h2 className="mb-2 text-2xl font-bold">عدّ ثم المس الرقم</h2>
      <div className="mx-auto my-4 flex max-w-xs flex-wrap justify-center gap-3">
        {Array.from({ length: round.n }, (_, index) => (
          <span key={index} className="h-8 w-8 rounded-full bg-gulf" />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {round.options.map((id) => (
          <button
            key={id}
            type="button"
            className={`${gulf} min-w-16 text-3xl`}
            onClick={() => {
              const ok = id === round.answer;
              record(name, round.answer, ok);
              setNote(ok ? "أحسنت" : glyphOf(round.answer)?.shape ?? "انظر مرة أخرى");
              void speak(ok ? "أحسنت" : "انظر مرة أخرى");
            }}
          >
            {id}
          </button>
        ))}
      </div>
      {note ? <p className="mt-3 font-semibold">{note}</p> : null}
      <button
        type="button"
        className={`${paper} mt-3`}
        onClick={() => {
          setNote("");
          setRound(NUMS[Math.floor(Math.random() * NUMS.length)] ?? round);
        }}
      >
        رقم جديد
      </button>
    </div>
  );
}

function FormGame({ name }: { name: string }) {
  const record = useRoom((state) => state.record);
  const notify = useRoom((state) => state.notify);
  const [cards, setCards] = useState<Face[]>(deal);
  const [picked, setPicked] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const done = cards.every((card) => card.done);

  function flip(index: number) {
    if (lock || cards[index]?.open || cards[index]?.done) return;
    const next = [...picked, index];
    setCards(cards.map((card, i) => (i === index ? { ...card, open: true } : card)));
    setPicked(next);
    void speak(cards[index]?.letter ?? "");
    if (next.length < 2) return;
    const first = cards[next[0] ?? 0];
    const second = cards[next[1] ?? 0];
    if (!first || !second) return;
    const match = first.letter === second.letter && first.kind !== second.kind;
    setLock(true);
    window.setTimeout(() => {
      setCards((current) =>
        current.map((card, i) => {
          if (!next.includes(i)) return card;
          return match ? { ...card, done: true, open: true } : { ...card, open: false };
        }),
      );
      setPicked([]);
      setLock(false);
      if (match) record(name, first.letter, true);
      else {
        record(name, first.letter, false);
        if (second.letter !== first.letter) record(name, second.letter, false);
      }
      void speak(match ? "أحسنت" : "جرّب مرة أخرى");
      if (!match) notify("طابق الحرف مع شكله في أول الكلمة");
    }, 700);
  }

  return (
    <div className={`${card} text-center`}>
      <h2 className="mb-3 text-2xl font-bold">طابق الحرف مع شكله أول الكلمة</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {cards.map((cardFace, index) => (
          <button
            key={cardFace.id}
            type="button"
            className={`${cardFace.done ? gulf : cardFace.open ? clay : paper} h-20 w-20 text-3xl`}
            onClick={() => flip(index)}
          >
            {cardFace.open || cardFace.done ? cardFace.shown : "؟"}
          </button>
        ))}
      </div>
      {done ? (
        <button type="button" className={`${paper} mt-4`} onClick={() => setCards(deal())}>
          لعبة جديدة
        </button>
      ) : null}
    </div>
  );
}

function Stars({ name }: { name: string }) {
  const db = useRoom((state) => state.db);
  const savePhoto = useRoom((state) => state.savePhoto);
  const notify = useRoom((state) => state.notify);
  const user = db.users[name];
  const [gate, setGate] = useState(false);
  const [password, setPassword] = useState("");
  const [caption, setCaption] = useState("");
  if (!user) return null;
  const data = user.data;
  const score = accuracy(data.quiz);
  const filled = Math.min(5, data.draws.length + data.chants.length + (score !== null && score >= 60 ? 1 : 0));
  const rows = ranked(data.quiz);

  async function unlock() {
    if ((await hashPassword(password, user.salt)) !== user.hash) {
      notify("كلمة المرور غير صحيحة");
      return;
    }
    setGate(true);
  }

  return (
    <section className="grid gap-3">
      <div className={card}>
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
          <Star className="h-6 w-6 text-clay" />
          نجومي
        </h2>
        <div className="mb-3 flex gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className={`h-7 w-7 ${index < filled ? "fill-clay text-clay" : "text-line"}`} />
          ))}
        </div>
        <p>
          أناشيد: <b>{data.chants.length}</b> · رسومات: <b>{data.draws.length}</b> · الدقة:{" "}
          <b>{score === null ? "—" : `${score}%`}</b>
        </p>
        <p className="mt-2 text-mist">كل رسمة نجم. لست مطالبًا أن تشبه غيرك.</p>
        <div className="mt-3 grid gap-2">
          {rows.length ? (
            rows.map((row) => (
              <div key={row.id}>
                <div className="flex justify-between">
                  <span className="text-2xl">{row.id}</span>
                  <span className="text-mist">
                    {row.ok} صواب · {row.err} محاولة
                  </span>
                </div>
                <Meter ok={row.ok} err={row.err} />
              </div>
            ))
          ) : (
            <p className="text-mist">العب لتظهر الحروف هنا.</p>
          )}
        </div>
      </div>
      <div className={card}>
        <h2 className="mb-2 text-2xl font-bold">إنجاز اليوم</h2>
        <p className="mb-2 text-mist">قسم للأهل. صوّروا أجمل حرف رسمه الطفل اليوم. الطفل لا يفتحه وحده.</p>
        <div className="mb-3 flex gap-2 overflow-x-auto">
          {data.photos.map((photo) => (
            <figure key={photo.t} className="shrink-0">
              <img src={photo.u} alt="" className="h-28 w-24 rounded-2xl border-2 border-line object-cover" />
              <figcaption className="text-center text-sm">{photo.l}</figcaption>
            </figure>
          ))}
          {data.draws.map((draw) => (
            <img key={draw.t} src={draw.u} alt="" className="h-28 w-24 shrink-0 rounded-2xl border-2 border-line object-cover" />
          ))}
        </div>
        {gate ? (
          <div className="grid gap-2">
            <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="ما الحرف الذي نتباهى به؟" />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 6_000_000) {
                  notify("الصورة كبيرة");
                  return;
                }
                const image = new Image();
                image.onload = () => {
                  const scale = Math.min(1, 320 / image.width);
                  const canvas = document.createElement("canvas");
                  canvas.width = Math.max(1, Math.round(image.width * scale));
                  canvas.height = Math.max(1, Math.round(image.height * scale));
                  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
                  savePhoto(name, caption || "حرف اليوم", canvas.toDataURL("image/jpeg", 0.6));
                  setGate(false);
                  notify("حُفظ الإنجاز");
                };
                image.src = URL.createObjectURL(file);
              }}
            />
          </div>
        ) : (
          <form
            className="grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void unlock();
            }}
          >
            <input
              dir="ltr"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="كلمة مرور الطالب"
              autoComplete="off"
            />
            <button className={paper} type="submit">
              قسم الأهل
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
