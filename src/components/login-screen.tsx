import { useState } from "react";
import { GraduationCap, UserRound } from "lucide-react";
import { DEMO } from "@/lib/pedagogy";
import { useRoom } from "@/lib/classroom";
import { Falcon, card, clay, gulf, paper } from "@/components/bits";

export function LoginScreen() {
  const ready = useRoom((state) => state.ready);
  const db = useRoom((state) => state.db);
  const loginStudent = useRoom((state) => state.loginStudent);
  const registerStudent = useRoom((state) => state.registerStudent);
  const loginTeacher = useRoom((state) => state.loginTeacher);
  const createTeacher = useRoom((state) => state.createTeacher);
  const [role, setRole] = useState<"stu" | "sup">("sup");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function run(task: () => Promise<string | null>) {
    if (!ready || pending) return;
    setPending(true);
    setError("");
    const message = await task();
    if (message) setError(message);
    setPending(false);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-4 py-6">
      <section className={`${card} flex flex-col items-center gap-3 text-center`}>
        <Falcon className="h-44 w-36" />
        <p className="text-sm font-semibold text-gulf">للعرض أمام اللجنة · نفس هذا الجهاز</p>
        <h1 className="text-4xl font-bold">صُقَيْر</h1>
        <p className="max-w-xl text-mist">
          صقر كويتي صغير لا يعلّم مكان المعلّم. المعلّم يدرّبه كل يوم، والطفل يسمع ويرسم ويلعب.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          className={`${card} border-gulf text-start sm:col-span-1`}
          disabled={!ready || pending}
          onClick={() => void run(() => loginTeacher(DEMO.sup.name, DEMO.sup.password))}
        >
          <GraduationCap className="mb-2 h-6 w-6 text-gulf" />
          <span className="block text-sm text-gulf">ابدأ من هنا</span>
          <span className="block text-xl font-bold">المعلّمة {DEMO.sup.name}</span>
          <span className="mt-1 block text-mist" dir="ltr">
            {DEMO.sup.password}
          </span>
        </button>
        <button
          type="button"
          className={`${card} text-start`}
          disabled={!ready || pending}
          onClick={() => void run(() => loginStudent(DEMO.nora.name, DEMO.nora.password))}
        >
          <UserRound className="mb-2 h-6 w-6" />
          <span className="block text-xl font-bold">الطالبة {DEMO.nora.name}</span>
          <span className="text-mist">تحتاج الباء والستة</span>
          <span className="mt-1 block text-mist" dir="ltr">
            {DEMO.nora.password}
          </span>
        </button>
        <button
          type="button"
          className={`${card} text-start`}
          disabled={!ready || pending}
          onClick={() => void run(() => loginStudent(DEMO.salem.name, DEMO.salem.password))}
        >
          <UserRound className="mb-2 h-6 w-6" />
          <span className="block text-xl font-bold">الطالب {DEMO.salem.name}</span>
          <span className="text-mist">يتقدّم بثبات</span>
          <span className="mt-1 block text-mist" dir="ltr">
            {DEMO.salem.password}
          </span>
        </button>
      </section>

      <section className={card}>
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" className={role === "sup" ? clay : paper} onClick={() => setRole("sup")}>
            دخول المعلّم
          </button>
          <button type="button" className={role === "stu" ? clay : paper} onClick={() => setRole("stu")}>
            دخول الطالب
          </button>
        </div>
        <form
          className="grid gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (role === "sup") {
              void run(() => (db.sup ? loginTeacher(name, password) : createTeacher(name, password)));
            } else {
              void run(() => loginStudent(name, password));
            }
          }}
        >
          <label className="grid gap-1">
            <span className="text-mist">{role === "sup" ? "اسم المعلّم" : "اسم مستعار، لا الاسم الكامل"}</span>
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" />
          </label>
          <label className="grid gap-1">
            <span className="text-mist">كلمة المرور</span>
            <input
              dir="ltr"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
            />
          </label>
          {error ? <p className="font-semibold text-clay">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <button className={gulf} type="submit" disabled={!ready || pending}>
              {pending ? "نتحقق…" : "دخول"}
            </button>
            {role === "stu" ? (
              <button
                className={paper}
                type="button"
                disabled={!ready || pending}
                onClick={() => void run(() => registerStudent(name, password))}
              >
                حساب طالب جديد
              </button>
            ) : null}
          </div>
        </form>
        <p className="mt-3 text-mist">
          {!ready
            ? "نجهّز صف العرض وكلمات المرور المشفّرة…"
            : "كلمة المرور تُشتق بـ PBKDF2 ولا تُحفظ كنص. بيانات الطالب يراها هو والمعلّم فقط على هذا الجهاز. لا تُدخل اسم طفل حقيقي."}
        </p>
      </section>

      <p className="px-1 text-mist">
        مستلهم من روح فيلم كل طفل نجم: المعلّم يرفض أن يسمّي الطفل كسولًا، والحرف يُرسم باليد، والإيقاع يثبت الصوت.
        صُقَيْر أداة مساندة، لا تشخيص ولا علاج.
      </p>
    </div>
  );
}
