import { create } from "zustand";
import { canon } from "@/lib/pedagogy";
import {
  blankDb,
  clearDb,
  emptyData,
  hashPassword,
  loadDb,
  randomSalt,
  saveDb,
  seedDb,
  type Db,
  type StudentData,
  type TrainNote,
} from "@/lib/vault";
import type { VoiceMode } from "@/lib/pedagogy";

const SESSION = "suqayr-session";

export type Me = { role: "stu" | "sup"; name: string };

type Room = {
  ready: boolean;
  db: Db;
  me: Me | null;
  toast: string | null;
  boot: () => Promise<void>;
  notify: (message: string) => void;
  loginStudent: (name: string, password: string) => Promise<string | null>;
  registerStudent: (name: string, password: string) => Promise<string | null>;
  loginTeacher: (name: string, password: string) => Promise<string | null>;
  createTeacher: (name: string, password: string) => Promise<string | null>;
  logout: () => void;
  resetDemo: () => Promise<void>;
  setVoice: (voice: VoiceMode) => void;
  setEnglish: (english: boolean) => void;
  setLesson: (lesson: string) => void;
  setRules: (rules: string[]) => void;
  addNote: (note: Omit<TrainNote, "id" | "at">) => void;
  removeNote: (id: string) => void;
  addLog: (name: string, question: string) => void;
  record: (name: string, id: string, ok: boolean) => void;
  saveDraw: (name: string, letter: string, url: string) => void;
  saveChant: (name: string, topic: string) => void;
  savePhoto: (name: string, caption: string, url: string) => void;
  resetStudentPassword: (name: string, password: string) => Promise<string | null>;
  deleteStudent: (name: string) => void;
  changeTeacherPassword: (password: string) => Promise<string | null>;
};

let bootPromise: Promise<void> | null = null;
let toastTimer = 0;

function readSession(db: Db): Me | null {
  try {
    const raw = sessionStorage.getItem(SESSION);
    if (!raw) return null;
    const me = JSON.parse(raw) as Me;
    if (me.role === "sup" && db.sup && me.name === db.sup.name) return me;
    if (me.role === "stu" && db.users[me.name]) return me;
  } catch {
    /* ignore broken session */
  }
  return null;
}

function writeSession(me: Me | null) {
  if (!me) sessionStorage.removeItem(SESSION);
  else sessionStorage.setItem(SESSION, JSON.stringify(me));
}

export const useRoom = create<Room>((set, get) => {
  function commit(db: Db) {
    saveDb(db);
    set({ db });
  }

  function patchStudent(name: string, fn: (data: StudentData) => StudentData) {
    const { db } = get();
    const user = db.users[name];
    if (!user) return;
    commit({
      ...db,
      users: { ...db.users, [name]: { ...user, data: fn(user.data) } },
    });
  }

  return {
    ready: false,
    db: blankDb(),
    me: null,
    toast: null,
    boot: () => {
      if (bootPromise) return bootPromise;
      bootPromise = (async () => {
        try {
          const db = loadDb() ?? (await seedDb());
          if (!loadDb()) saveDb(db);
          set({ db, me: readSession(db), ready: true });
        } catch {
          set({ ready: true, toast: "تعذّر فتح حفظ هذا المتصفح" });
        }
      })();
      return bootPromise;
    },
    notify: (message) => {
      window.clearTimeout(toastTimer);
      set({ toast: message });
      toastTimer = window.setTimeout(() => set({ toast: null }), 2800);
    },
    loginStudent: async (name, password) => {
      const user = get().db.users[name.trim()];
      if (!user || (await hashPassword(password, user.salt)) !== user.hash) return "الاسم أو كلمة المرور غير صحيحة";
      const me: Me = { role: "stu", name: name.trim() };
      writeSession(me);
      set({ me });
      return null;
    },
    registerStudent: async (name, password) => {
      const nick = name.trim();
      if (!nick || password.length < 4) return "اسم مستعار، وكلمة مرور من 4 أحرف على الأقل";
      if (nick.length > 24) return "الاسم المستعار أقصر من ذلك";
      if (get().db.users[nick]) return "الاسم مستخدم. اختر اسمًا آخر";
      const salt = randomSalt();
      const hash = await hashPassword(password, salt);
      const db: Db = {
        ...get().db,
        users: {
          ...get().db.users,
          [nick]: { salt, hash, created: Date.now(), data: emptyData() },
        },
      };
      commit(db);
      const me: Me = { role: "stu", name: nick };
      writeSession(me);
      set({ me });
      return null;
    },
    loginTeacher: async (name, password) => {
      const sup = get().db.sup;
      if (!sup || name.trim() !== sup.name || (await hashPassword(password, sup.salt)) !== sup.hash) {
        return "بيانات المعلّم غير صحيحة";
      }
      const me: Me = { role: "sup", name: sup.name };
      writeSession(me);
      set({ me });
      return null;
    },
    createTeacher: async (name, password) => {
      if (get().db.sup) return "حساب المعلّم موجود";
      const nick = name.trim();
      if (!nick || password.length < 4) return "اسم وكلمة مرور من 4 أحرف على الأقل";
      const salt = randomSalt();
      const hash = await hashPassword(password, salt);
      commit({ ...get().db, sup: { name: nick, salt, hash } });
      const me: Me = { role: "sup", name: nick };
      writeSession(me);
      set({ me });
      return null;
    },
    logout: () => {
      writeSession(null);
      set({ me: null });
    },
    resetDemo: async () => {
      clearDb();
      writeSession(null);
      const db = await seedDb();
      saveDb(db);
      set({ db, me: null, toast: "عاد صف العرض كما كان" });
    },
    setVoice: (voice) => commit({ ...get().db, voice }),
    setEnglish: (english) => commit({ ...get().db, english }),
    setLesson: (lesson) => commit({ ...get().db, lesson: lesson.slice(0, 240) }),
    setRules: (rules) => commit({ ...get().db, rules: rules.slice(0, 20) }),
    addNote: (note) => {
      const next: TrainNote = {
        ...note,
        id: randomSalt(),
        at: Date.now(),
        topic: note.topic.slice(0, 24),
        how: note.how.slice(0, 180),
        say: note.say.slice(0, 160),
        dialect: note.dialect.slice(0, 80),
        english: note.english.slice(0, 32),
      };
      commit({ ...get().db, notes: [...get().db.notes, next].slice(-24) });
    },
    removeNote: (id) => commit({ ...get().db, notes: get().db.notes.filter((note) => note.id !== id) }),
    addLog: (name, question) => {
      const logs = [...get().db.logs, { u: name, q: question.slice(0, 80), t: Date.now() }].slice(-50);
      commit({ ...get().db, logs });
    },
    record: (name, id, ok) => {
      const key = canon(id);
      patchStudent(name, (data) => {
        const cell = data.quiz[key] ?? { ok: 0, err: 0 };
        return {
          ...data,
          quiz: { ...data.quiz, [key]: ok ? { ok: cell.ok + 1, err: cell.err } : { ok: cell.ok, err: cell.err + 1 } },
        };
      });
    },
    saveDraw: (name, letter, url) => {
      patchStudent(name, (data) => ({
        ...data,
        draws: [...data.draws, { t: Date.now(), l: letter, u: url }].slice(-8),
      }));
    },
    saveChant: (name, topic) => {
      patchStudent(name, (data) => ({
        ...data,
        chants: [...data.chants, { t: Date.now(), x: topic.slice(0, 40) }].slice(-12),
      }));
    },
    savePhoto: (name, caption, url) => {
      patchStudent(name, (data) => ({
        ...data,
        photos: [...data.photos, { t: Date.now(), l: caption.slice(0, 30), u: url }].slice(-6),
      }));
    },
    resetStudentPassword: async (name, password) => {
      if (password.length < 4) return "4 أحرف على الأقل";
      const user = get().db.users[name];
      if (!user) return "لا يوجد هذا الطالب";
      const salt = randomSalt();
      const hash = await hashPassword(password, salt);
      commit({ ...get().db, users: { ...get().db.users, [name]: { ...user, salt, hash } } });
      return null;
    },
    deleteStudent: (name) => {
      const users = { ...get().db.users };
      delete users[name];
      commit({ ...get().db, users });
    },
    changeTeacherPassword: async (password) => {
      const sup = get().db.sup;
      if (!sup) return "لا يوجد حساب معلّم";
      if (password.length < 4) return "4 أحرف على الأقل";
      const salt = randomSalt();
      const hash = await hashPassword(password, salt);
      commit({ ...get().db, sup: { ...sup, salt, hash } });
      return null;
    },
  };
});
