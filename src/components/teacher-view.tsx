import { useState } from "react";
import { BookOpen, Images, Shield, Users } from "lucide-react";
import { pingGrok, suggestLesson } from "@/lib/grok.functions";
import { useRoom } from "@/lib/classroom";
import { DEFAULT_RULES, FAMILIES, GLYPHS, accuracy, glyphOf, ranked, type VoiceMode } from "@/lib/pedagogy";
import { Falcon, Meter, TopBar, card, clay, gulf, paper } from "@/components/bits";
import { setVoiceEnabled, speak, voiceEnabled } from "@/lib/speech";

type Tab = "class" | "train" | "method" | "rules" | "show";

const VOICES: { id: VoiceMode; label: string }[] = [
  { id: "fusha", label: "فصحى" },
  { id: "mix", label: "مزيج" },
  { id: "kuwaiti", label: "كويتية" },
];

const PAIRS = [
  ["ب", "ت", "ث"],
  ["ج", "ح", "خ"],
  ["٦", "٩"],
  ["٢", "٣"],
  ["٠", "٥"],
];

export function TeacherView() {
  const me = useRoom((state) => state.me);
  const db = useRoom((state) => state.db);
  const [tab, setTab] = useState<Tab>("class");
  const [heard, setHeard] = useState(voiceEnabled());
  const seed = glyphOf("ب");
  const saved = [...db.notes].reverse().find((item) => item.topic === "ب");
  const [sel, setSel] = useState("ب");
  const [how, setHow] = useState(saved?.how || seed?.steps.join(" ") || "");
  const [say, setSay] = useState(saved?.say || seed?.child || "");
  const [dialect, setDialect] = useState(saved?.dialect || seed?.dialect || "");
  const [en, setEn] = useState(saved?.english || seed?.en || "");

  function fill(id: string) {
    const glyph = glyphOf(id);
    if (!glyph) return;
    setSel(id);
    const note = [...db.notes].reverse().find((item) => item.topic === id);
    setHow(note?.how || glyph.steps.join(" "));
    setSay(note?.say || glyph.child);
    setDialect(note?.dialect || glyph.dialect);
    setEn(note?.english || glyph.en);
  }

  function toggleVoice() {
    const next = !voiceEnabled();
    setVoiceEnabled(next);
    setHeard(next);
  }

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-4">
      <TopBar title={`لوحة ${me?.name ?? "المعلّم"}`} heard={heard} onHear={toggleVoice} />
      <p className="mb-3 text-mist">صُقَيْر لا يقرّر. المعلّم يدرّبه، وهو يردّد الطريقة.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className={tab === "class" ? clay : paper} onClick={() => setTab("class")}>
          <Users className="h-5 w-5" /> الصف
        </button>
        <button type="button" className={tab === "train" ? clay : paper} onClick={() => setTab("train")}>
          تدريب
        </button>
        <button type="button" className={tab === "method" ? clay : paper} onClick={() => setTab("method")}>
          <BookOpen className="h-5 w-5" /> الطريقة
        </button>
        <button type="button" className={tab === "rules" ? clay : paper} onClick={() => setTab("rules")}>
          <Shield className="h-5 w-5" /> المحاذير
        </button>
        <button type="button" className={tab === "show" ? clay : paper} onClick={() => setTab("show")}>
          <Images className="h-5 w-5" /> المعرض
        </button>
      </div>
      {tab === "class" ? <ClassTab /> : null}
      {tab === "train" ? (
        <TrainTab
          sel={sel}
          how={how}
          say={say}
          dialect={dialect}
          en={en}
          onHow={setHow}
          onSay={setSay}
          onDialect={setDialect}
          onEn={setEn}
          onPick={fill}
        />
      ) : null}
      {tab === "method" ? (
        <MethodTab
          sel={sel}
          onPick={(id) => {
            fill(id);
          }}
          onUse={(id) => {
            fill(id);
            setTab("train");
          }}
        />
      ) : null}
      {tab === "rules" ? <RulesTab /> : null}
      {tab === "show" ? <ShowTab /> : null}
    </div>
  );
}

function ClassTab() {
  const db = useRoom((state) => state.db);
  const notify = useRoom((state) => state.notify);
  const resetDemo = useRoom((state) => state.resetDemo);
  const [open, setOpen] = useState<string | null>("نورة");
  const [online, setOnline] = useState<string>("");
  const [confirm, setConfirm] = useState(false);
  const names = Object.keys(db.users);

  return (
    <div className="grid gap-3">
      <section className={card}>
        <h2 className="mb-2 text-2xl font-bold">سيناريو العرض، ثلاث دقائق</h2>
        <ol className="grid list-decimal gap-2 pr-5 text-base">
          <li>ابدأ من هنا: نورة تخلط الباء، والستة ذيلها ينقلب.</li>
          <li>افتح «الطريقة» ثم «تدريب». عدّل جملة صُقَيْر واحفظها. بدّل الصوت.</li>
          <li>افحص غروك. اخرج وادخل نورة. اسأل: كيف أكتب الباء؟</li>
          <li>أنشودة، رسم بالإصبع، ثم لعبة. ارجع: المعرض والسجل يتحدّثان عن الدرس.</li>
        </ol>
        <p className="mt-2 text-mist">كل الحسابات على هذا الجهاز. بدّل بينها من زر الخروج.</p>
        <button
          type="button"
          className={`${paper} mt-3`}
          onClick={() => {
            setOnline("نفحص…");
            void pingGrok({ data: {} }).then((result) => {
              const line = result.online ? "غروك متصل. تدريب المعلّمة يصل إليه." : "غروك غير متصل. صُقَيْر يجيب من تدريبك المحفوظ.";
              setOnline(line);
              notify(line);
            });
          }}
        >
          افحص غروك
        </button>
        {online ? <p className="mt-2 font-semibold">{online}</p> : null}
      </section>
      <section className={card}>
        <div className="mb-3 flex items-center gap-3">
          <Falcon className="h-20 w-16" />
          <div>
            <h2 className="text-2xl font-bold">الطلاب ({names.length})</h2>
            <p className="text-mist">
              صوت صُقَيْر: {VOICES.find((item) => item.id === db.voice)?.label} · الإنجليزية {db.english ? "مرة واحدة" : "مغلقة"}
            </p>
          </div>
        </div>
        {names.map((student) => {
          const rec = db.users[student];
          if (!rec) return null;
          const score = accuracy(rec.data.quiz);
          const weak = ranked(rec.data.quiz)
            .filter((item) => item.err > 0)
            .slice(0, 3);
          return (
            <div key={student} className="border-t-2 border-line py-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <b>{student}</b>
                  <p className="text-mist">
                    دقة {score === null ? "—" : `${score}%`} · رسوم {rec.data.draws.length} · أناشيد {rec.data.chants.length}
                  </p>
                </div>
                <button type="button" className={paper} onClick={() => setOpen(open === student ? null : student)}>
                  تفاصيل
                </button>
              </div>
              {open === student ? <Detail name={student} weak={weak.map((item) => item.id)} /> : null}
            </div>
          );
        })}
      </section>
      <button
        type="button"
        className={paper}
        onClick={() => {
          if (!confirm) {
            setConfirm(true);
            return;
          }
          void resetDemo();
        }}
      >
        {confirm ? "تأكيد استرجاع صف العرض" : "استرجاع صف العرض"}
      </button>
    </div>
  );
}

function Detail({ name, weak }: { name: string; weak: string[] }) {
  const db = useRoom((state) => state.db);
  const resetStudentPassword = useRoom((state) => state.resetStudentPassword);
  const deleteStudent = useRoom((state) => state.deleteStudent);
  const notify = useRoom((state) => state.notify);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const rec = db.users[name];
  if (!rec) return null;
  const chants = rec.data.chants.slice(-4).map((item) => item.x).join(" · ");
  return (
    <div className="mt-3 grid gap-2">
      <p>
        يحتاج دعمًا: <b>{weak.join(" ، ") || "لا شيء واضح بعد"}</b>
      </p>
      <p className="text-mist">طلب في الأناشيد: {chants || "—"}</p>
      <div className="flex gap-2 overflow-x-auto">
        {[...rec.data.draws, ...rec.data.photos].map((item) => (
          <img key={item.t} src={item.u} alt="" className="h-24 w-20 shrink-0 rounded-2xl border-2 border-line object-cover" />
        ))}
      </div>
      {ranked(rec.data.quiz).map((row) => (
        <div key={row.id}>
          <span className="text-xl">{row.id}</span>
          <Meter ok={row.ok} err={row.err} />
        </div>
      ))}
      <input
        dir="ltr"
        type="password"
        value={password}
        autoComplete="off"
        placeholder="كلمة مرور جديدة للطالب"
        onChange={(event) => setPassword(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={gulf}
          onClick={() => {
            void resetStudentPassword(name, password).then((error) => notify(error ?? "تغيّرت كلمة المرور"));
          }}
        >
          إعادة التعيين
        </button>
        <button
          type="button"
          className={`${btnDanger}`}
          onClick={() => {
            if (!confirm) {
              setConfirm(true);
              return;
            }
            deleteStudent(name);
          }}
        >
          {confirm ? "تأكيد الحذف" : "حذف الطالب وبياناته"}
        </button>
      </div>
    </div>
  );
}

const btnDanger = "inline-flex min-h-11 items-center justify-center rounded-2xl bg-clay px-4 py-2 font-semibold text-clay-ink";

function TrainTab({
  sel,
  how,
  say,
  dialect,
  en,
  onHow,
  onSay,
  onDialect,
  onEn,
  onPick,
}: {
  sel: string;
  how: string;
  say: string;
  dialect: string;
  en: string;
  onHow: (value: string) => void;
  onSay: (value: string) => void;
  onDialect: (value: string) => void;
  onEn: (value: string) => void;
  onPick: (id: string) => void;
}) {
  const db = useRoom((state) => state.db);
  const setVoice = useRoom((state) => state.setVoice);
  const setEnglish = useRoom((state) => state.setEnglish);
  const setLesson = useRoom((state) => state.setLesson);
  const addNote = useRoom((state) => state.addNote);
  const removeNote = useRoom((state) => state.removeNote);
  const notify = useRoom((state) => state.notify);
  const [lesson, setLessonText] = useState(db.lesson);
  const [drafting, setDrafting] = useState(false);
  const glyph = glyphOf(sel);

  async function draft() {
    setDrafting(true);
    try {
      const result = await suggestLesson({
        data: { symbol: sel, name: glyph?.name ?? "", confuses: glyph?.confuses ?? "", notes: how },
      });
      if (!result.raw) {
        notify("غروك غير متصل. بقيت طريقتك الجاهزة.");
        return;
      }
      const child = result.raw.match(/للطفل:\s*(.+)/)?.[1]?.trim();
      const kuwaiti = result.raw.match(/كويتي:\s*(.+)/)?.[1]?.trim();
      const steps = result.raw
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^[0-9٠-٩]/.test(line))
        .map((line) => line.replace(/^[0-9٠-٩]+[.)\-\s]+/, ""))
        .join(" ");
      if (child) onSay(child);
      if (kuwaiti) onDialect(kuwaiti);
      if (steps) onHow(steps);
      notify("مسودة غروك في الحقول. راجعها ثم احفظها.");
    } catch {
      notify("تعذّر الاتصال بغروك");
    } finally {
      setDrafting(false);
    }
  }

  return (
    <div className="grid gap-3">
      <section className={card}>
        <h2 className="mb-2 text-2xl font-bold">صوت صُقَيْر</h2>
        <div className="flex flex-wrap gap-2">
          {VOICES.map((item) => (
            <button key={item.id} type="button" className={db.voice === item.id ? clay : paper} onClick={() => setVoice(item.id)}>
              {item.label}
            </button>
          ))}
          <button type="button" className={db.english ? clay : paper} onClick={() => setEnglish(!db.english)}>
            {db.english ? "إنجليزية: مرة" : "إنجليزية: لا"}
          </button>
        </div>
        <label className="mt-3 grid gap-1">
          <span>درس اليوم الذي يلتزم به</span>
          <textarea value={lesson} onChange={(event) => setLessonText(event.target.value)} />
        </label>
        <button
          type="button"
          className={`${gulf} mt-2`}
          onClick={() => {
            setLesson(lesson);
            notify("حُفظ درس اليوم");
          }}
        >
          احفظ درس اليوم
        </button>
      </section>
      <section className={card}>
        <h2 className="mb-2 text-2xl font-bold">درّب صُقَيْر على رمز</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {GLYPHS.map((item) => (
            <button key={item.id} type="button" className={`${sel === item.id ? clay : paper} min-w-11 px-3 text-2xl`} onClick={() => onPick(item.id)}>
              {item.id}
            </button>
          ))}
        </div>
        {glyph ? <p className="mt-2 text-mist">يختلط مع {glyph.confuses}. المادة المقترحة: {glyph.material}.</p> : null}
        <label className="grid gap-1">
          طريقتك
          <textarea value={how} onChange={(event) => onHow(event.target.value)} />
        </label>
        <label className="mt-2 grid gap-1">
          الجملة التي يقولها للطفل
          <textarea value={say} onChange={(event) => onSay(event.target.value)} />
        </label>
        <label className="mt-2 grid gap-1">
          خاتمة كويتية خفيفة
          <input value={dialect} onChange={(event) => onDialect(event.target.value)} />
        </label>
        <label className="mt-2 grid gap-1">
          الكلمة الإنجليزية مرة واحدة
          <input dir="ltr" value={en} onChange={(event) => onEn(event.target.value)} />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={gulf}
            onClick={() => {
              if (!say.trim()) {
                notify("اكتب الجملة التي يقولها صُقَيْر");
                return;
              }
              addNote({ topic: sel, how, say, dialect, english: en });
              notify("تعلّم صُقَيْر طريقتك");
              void speak(say);
            }}
          >
            احفظ تدريب اليوم
          </button>
          <button type="button" className={paper} disabled={drafting} onClick={() => void draft()}>
            {drafting ? "غروك يكتب مسودة…" : "مسودة من غروك"}
          </button>
        </div>
        <p className="mt-2 text-mist">لا يُرسل اسم حقيقي ولا صورة. يُرسل التدريب والمحاذير وسؤال الطفل فقط.</p>
      </section>
      <section className={card}>
        <h2 className="mb-2 text-xl font-bold">ما حفظه صُقَيْر</h2>
        {db.notes.length === 0 ? <p className="text-mist">لا تدريب بعد.</p> : null}
        {[...db.notes].reverse().map((note) => (
          <div key={note.id} className="border-t-2 border-line py-2">
            <div className="flex items-start justify-between gap-2">
              <p>
                <b className="text-2xl">{note.topic}</b> {note.say}
              </p>
              <button type="button" className={paper} onClick={() => removeNote(note.id)}>
                حذف
              </button>
            </div>
            <p className="text-mist">{note.dialect} {note.english}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function MethodTab({ sel, onPick, onUse }: { sel: string; onPick: (id: string) => void; onUse: (id: string) => void }) {
  const glyph = glyphOf(sel);
  return (
    <div className="grid gap-3">
      <section className={card}>
        <h2 className="mb-2 text-2xl font-bold">كيف أعلّم هذا الرمز</h2>
        <p className="mb-3 text-mist">حركة وصوت ولمس. بلا تشخيص، وبلا تشبيه الحرف بحيوان لا يشبهه.</p>
        {PAIRS.map((group) => (
          <div key={group.join("-")} className="mb-2 flex flex-wrap gap-2">
            {group.map((id) => (
              <button key={id} type="button" className={`${sel === id ? clay : paper} min-w-14 text-2xl`} onClick={() => onPick(id)}>
                {id}
              </button>
            ))}
          </div>
        ))}
        <p className="text-sm text-mist">المجموعات التي تتشابه بالنقاط أو بالذيل. باقي الحروف تحت.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {GLYPHS.map((item) => (
            <button key={item.id} type="button" className={sel === item.id ? clay : paper} onClick={() => onPick(item.id)}>
              {item.id}
            </button>
          ))}
        </div>
      </section>
      {glyph ? (
        <section className={card}>
          <h2 className="text-3xl font-bold">
            {glyph.id} · {glyph.name}
          </h2>
          <p className="text-clay">يختلط مع {glyph.confuses}</p>
          <p className="mt-1">{glyph.shape}</p>
          <ol className="mt-3 grid list-decimal gap-2 pr-5">
            {glyph.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3">قل للطفل: {glyph.child}</p>
          <p className="text-mist">{glyph.dialect}</p>
          <button type="button" className={`${gulf} mt-3`} onClick={() => onUse(glyph.id)}>
            انقلي هذا إلى تدريب صُقَيْر
          </button>
          <button type="button" className={`${paper} mt-2`} onClick={() => void speak(`${glyph.name}. ${glyph.child}`)}>
            اسمع الجملة
          </button>
        </section>
      ) : null}
      <p className="text-mist">
        النقطة فرق الباء والتاء والثاء. الذيل فرق الستة والتسعة. هذا دعم داخل الصف، لا يسمّي صعوبة ولا يغني عن المعلّم.
      </p>
      <p className="text-sm text-mist">أُسر الحروف: {FAMILIES.map((family) => family.join(" ")).join(" · ")}</p>
    </div>
  );
}

function RulesTab() {
  const db = useRoom((state) => state.db);
  const setRules = useRoom((state) => state.setRules);
  const notify = useRoom((state) => state.notify);
  const changeTeacherPassword = useRoom((state) => state.changeTeacherPassword);
  const [text, setText] = useState(db.rules.join("\n"));
  const [password, setPassword] = useState("");
  return (
    <div className="grid gap-3">
      <section className={card}>
        <h2 className="mb-2 text-2xl font-bold">قائمة المحاذير</h2>
        <p className="mb-2 text-mist">سطر لكل بند. إن مسّها السؤال فالجواب وحده: اسأل معلّمك، ليس من حقي الإجابة عن ذلك.</p>
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={8} />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className={gulf}
            onClick={() => {
              const rules = text.split("\n").map((line) => line.trim()).filter(Boolean);
              setRules(rules.length ? rules : [...DEFAULT_RULES]);
              notify("حُفظت القائمة");
            }}
          >
            حفظ
          </button>
          <button
            type="button"
            className={paper}
            onClick={() => {
              setText(DEFAULT_RULES.join("\n"));
              setRules([...DEFAULT_RULES]);
              notify("عادت القائمة الأصلية");
            }}
          >
            الافتراضي
          </button>
        </div>
        <p className="mt-2 text-mist">حدود السلامة الدنيا تبقى حتى لو قُصّرت القائمة: عنف، ومخدرات، وطلب عنوان أو هاتف.</p>
      </section>
      <section className={card}>
        <h2 className="mb-2 text-xl font-bold">ما رُفض</h2>
        {db.logs.length === 0 ? <p className="text-mist">لا شيء بعد.</p> : null}
        {[...db.logs].reverse().slice(0, 12).map((log) => (
          <p key={`${log.t}-${log.q}`} className="border-t-2 border-line py-2 text-mist">
            {log.u}: {log.q}
          </p>
        ))}
      </section>
      <section className={card}>
        <h2 className="mb-2 text-xl font-bold">كلمة مرور المعلّم</h2>
        <input dir="ltr" type="password" value={password} autoComplete="off" onChange={(event) => setPassword(event.target.value)} />
        <button
          type="button"
          className={`${gulf} mt-2`}
          onClick={() => {
            void changeTeacherPassword(password).then((error) => notify(error ?? "تغيّرت كلمة المرور"));
          }}
        >
          حفظ
        </button>
      </section>
    </div>
  );
}

function ShowTab() {
  const db = useRoom((state) => state.db);
  const tiles = Object.entries(db.users).flatMap(([student, rec]) =>
    [...rec.data.draws, ...rec.data.photos].map((item) => ({ ...item, student })),
  );
  return (
    <section className={card}>
      <h2 className="mb-2 text-2xl font-bold">معرض النجوم</h2>
      <p className="mb-3 text-mist">كما في نهاية الدرس: كل طفل يعلّق ما رسمته يده، لا درجته.</p>
      {tiles.length === 0 ? <p>لا لوحات بعد.</p> : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((item) => (
          <figure key={`${item.student}-${item.t}`} className="rounded-2xl border-2 border-line bg-sand p-2">
            <img src={item.u} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
            <figcaption className="mt-1 text-center">
              {item.student} · {"l" in item ? item.l : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
