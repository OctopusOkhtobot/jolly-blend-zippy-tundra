import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as INITIAL, c as accuracy, f as ranked, i as GLYPHS, l as canon, m as teacherReply, n as DEMO, p as shuffle, r as FAMILIES, s as WORDS, t as DEFAULT_RULES, u as glyphOf } from "./pedagogy-B6_7F1lk.mjs";
import { c as Pencil, d as Images, f as GraduationCap, i as UserRound, l as Mic, n as Volume2, o as Star, p as BookOpen, r as Users, s as Shield, t as VolumeX, u as LogOut } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-dVjmE-VU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "suqayr-db-v1";
var ITERATIONS = 8e4;
function emptyData() {
	return {
		quiz: {},
		draws: [],
		chants: [],
		photos: []
	};
}
function blankDb() {
	return {
		sup: null,
		users: {},
		rules: [...DEFAULT_RULES],
		logs: [],
		notes: [],
		voice: "mix",
		english: true,
		lesson: ""
	};
}
function randomSalt() {
	return [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(8))].map((value) => value.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
	const bits = await crypto.subtle.deriveBits({
		name: "PBKDF2",
		salt: enc.encode(salt),
		iterations: ITERATIONS,
		hash: "SHA-256"
	}, key, 256);
	return [...new Uint8Array(bits)].map((value) => value.toString(16).padStart(2, "0")).join("");
}
function letterArt(letter) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="255"><rect width="100%" height="100%" fill="#fffaf3"/><text x="170" y="175" text-anchor="middle" font-size="150" fill="#0f6e62" font-family="Tahoma,sans-serif">${letter}</text></svg>`;
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
async function secret(password) {
	const salt = randomSalt();
	return {
		salt,
		hash: await hashPassword(password, salt)
	};
}
async function seedDb() {
	const [sup, nora, salem] = await Promise.all([
		secret(DEMO.sup.password),
		secret(DEMO.nora.password),
		secret(DEMO.salem.password)
	]);
	const now = Date.now();
	return {
		sup: {
			name: DEMO.sup.name,
			...sup
		},
		users: {
			[DEMO.nora.name]: {
				...nora,
				created: now,
				data: {
					quiz: {
						ب: {
							ok: 1,
							err: 4
						},
						ت: {
							ok: 3,
							err: 1
						},
						ث: {
							ok: 0,
							err: 2
						},
						"٦": {
							ok: 1,
							err: 3
						},
						"٩": {
							ok: 1,
							err: 2
						}
					},
					draws: [{
						t: now - 86e6,
						l: "ب",
						u: letterArt("ب")
					}],
					chants: [{
						t: now - 36e5,
						x: "الباء"
					}],
					photos: []
				}
			},
			[DEMO.salem.name]: {
				...salem,
				created: now,
				data: {
					quiz: {
						ب: {
							ok: 4,
							err: 1
						},
						أ: {
							ok: 2,
							err: 0
						},
						"٢": {
							ok: 3,
							err: 1
						}
					},
					draws: [{
						t: now - 172e6,
						l: "٢",
						u: letterArt("٢")
					}],
					chants: [{
						t: now - 72e5,
						x: "رقم اثنين"
					}],
					photos: []
				}
			}
		},
		rules: [...DEFAULT_RULES],
		logs: [{
			u: DEMO.salem.name,
			q: "وين بيتكم؟",
			t: now - 5e6
		}],
		notes: [{
			id: "note-ba",
			at: now - 4e6,
			topic: "ب",
			how: "قارب من الصلصال. نقطة واحدة تحت القارب. لا تشبّه الحرف بحيوان. فرّقها عن التاء التي نقطتها فوق.",
			say: "باء. قارب صغير، ونقطة واحدة تحته.",
			dialect: "زين، سوّها مع معلّمك.",
			english: "ba"
		}, {
			id: "note-six",
			at: now - 3e6,
			topic: "٦",
			how: "عدّ ست تصفيقات. الذيل نازل. إذا طلع الذيل لفوق صارت تسعة.",
			say: "ستة. الذيل نازل لتحت.",
			dialect: "يلا نعدّ ستّة.",
			english: "six"
		}],
		voice: "mix",
		english: true,
		lesson: "اليوم نفرّق الباء عن التاء: النقطة تحت أو فوق. والستة ذيلها نازل."
	};
}
function loadDb() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
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
function saveDb(db) {
	localStorage.setItem(KEY, JSON.stringify(db));
}
function clearDb() {
	localStorage.removeItem(KEY);
}
var SESSION = "suqayr-session";
var bootPromise = null;
var toastTimer = 0;
function readSession(db) {
	try {
		const raw = sessionStorage.getItem(SESSION);
		if (!raw) return null;
		const me = JSON.parse(raw);
		if (me.role === "sup" && db.sup && me.name === db.sup.name) return me;
		if (me.role === "stu" && db.users[me.name]) return me;
	} catch {}
	return null;
}
function writeSession(me) {
	if (!me) sessionStorage.removeItem(SESSION);
	else sessionStorage.setItem(SESSION, JSON.stringify(me));
}
var useRoom = create((set, get) => {
	function commit(db) {
		saveDb(db);
		set({ db });
	}
	function patchStudent(name, fn) {
		const { db } = get();
		const user = db.users[name];
		if (!user) return;
		commit({
			...db,
			users: {
				...db.users,
				[name]: {
					...user,
					data: fn(user.data)
				}
			}
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
					const db = loadDb() ?? await seedDb();
					if (!loadDb()) saveDb(db);
					set({
						db,
						me: readSession(db),
						ready: true
					});
				} catch {
					set({
						ready: true,
						toast: "تعذّر فتح حفظ هذا المتصفح"
					});
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
			if (!user || await hashPassword(password, user.salt) !== user.hash) return "الاسم أو كلمة المرور غير صحيحة";
			const me = {
				role: "stu",
				name: name.trim()
			};
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
			commit({
				...get().db,
				users: {
					...get().db.users,
					[nick]: {
						salt,
						hash,
						created: Date.now(),
						data: emptyData()
					}
				}
			});
			const me = {
				role: "stu",
				name: nick
			};
			writeSession(me);
			set({ me });
			return null;
		},
		loginTeacher: async (name, password) => {
			const sup = get().db.sup;
			if (!sup || name.trim() !== sup.name || await hashPassword(password, sup.salt) !== sup.hash) return "بيانات المعلّم غير صحيحة";
			const me = {
				role: "sup",
				name: sup.name
			};
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
			commit({
				...get().db,
				sup: {
					name: nick,
					salt,
					hash
				}
			});
			const me = {
				role: "sup",
				name: nick
			};
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
			set({
				db,
				me: null,
				toast: "عاد صف العرض كما كان"
			});
		},
		setVoice: (voice) => commit({
			...get().db,
			voice
		}),
		setEnglish: (english) => commit({
			...get().db,
			english
		}),
		setLesson: (lesson) => commit({
			...get().db,
			lesson: lesson.slice(0, 240)
		}),
		setRules: (rules) => commit({
			...get().db,
			rules: rules.slice(0, 20)
		}),
		addNote: (note) => {
			const next = {
				...note,
				id: randomSalt(),
				at: Date.now(),
				topic: note.topic.slice(0, 24),
				how: note.how.slice(0, 180),
				say: note.say.slice(0, 160),
				dialect: note.dialect.slice(0, 80),
				english: note.english.slice(0, 32)
			};
			commit({
				...get().db,
				notes: [...get().db.notes, next].slice(-24)
			});
		},
		removeNote: (id) => commit({
			...get().db,
			notes: get().db.notes.filter((note) => note.id !== id)
		}),
		addLog: (name, question) => {
			const logs = [...get().db.logs, {
				u: name,
				q: question.slice(0, 80),
				t: Date.now()
			}].slice(-50);
			commit({
				...get().db,
				logs
			});
		},
		record: (name, id, ok) => {
			const key = canon(id);
			patchStudent(name, (data) => {
				const cell = data.quiz[key] ?? {
					ok: 0,
					err: 0
				};
				return {
					...data,
					quiz: {
						...data.quiz,
						[key]: ok ? {
							ok: cell.ok + 1,
							err: cell.err
						} : {
							ok: cell.ok,
							err: cell.err + 1
						}
					}
				};
			});
		},
		saveDraw: (name, letter, url) => {
			patchStudent(name, (data) => ({
				...data,
				draws: [...data.draws, {
					t: Date.now(),
					l: letter,
					u: url
				}].slice(-8)
			}));
		},
		saveChant: (name, topic) => {
			patchStudent(name, (data) => ({
				...data,
				chants: [...data.chants, {
					t: Date.now(),
					x: topic.slice(0, 40)
				}].slice(-12)
			}));
		},
		savePhoto: (name, caption, url) => {
			patchStudent(name, (data) => ({
				...data,
				photos: [...data.photos, {
					t: Date.now(),
					l: caption.slice(0, 30),
					u: url
				}].slice(-6)
			}));
		},
		resetStudentPassword: async (name, password) => {
			if (password.length < 4) return "4 أحرف على الأقل";
			const user = get().db.users[name];
			if (!user) return "لا يوجد هذا الطالب";
			const salt = randomSalt();
			const hash = await hashPassword(password, salt);
			commit({
				...get().db,
				users: {
					...get().db.users,
					[name]: {
						...user,
						salt,
						hash
					}
				}
			});
			return null;
		},
		deleteStudent: (name) => {
			const users = { ...get().db.users };
			delete users[name];
			commit({
				...get().db,
				users
			});
		},
		changeTeacherPassword: async (password) => {
			const sup = get().db.sup;
			if (!sup) return "لا يوجد حساب معلّم";
			if (password.length < 4) return "4 أحرف على الأقل";
			const salt = randomSalt();
			const hash = await hashPassword(password, salt);
			commit({
				...get().db,
				sup: {
					...sup,
					salt,
					hash
				}
			});
			return null;
		}
	};
});
var card = "rounded-card border-2 border-line bg-paper p-4";
var btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-center font-semibold";
var gulf = `${btn} bg-gulf text-gulf-ink`;
var paper = `${btn} border-2 border-line bg-paper text-ink`;
var clay = `${btn} bg-clay text-clay-ink`;
function Falcon({ className = "h-36 w-28" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/suqayr.jpg",
		alt: "صُقَيْر، صقر كويتي صغير",
		className: `${className} rounded-card border-2 border-line object-cover object-top`
	});
}
function sourceLabel(source) {
	if (source === "grok") return "قالها صُقَيْر بمساعدة غروك، كما درّبه المعلّم";
	if (source === "guard") return "أوقفه حاجز المحاذير قبل أن يجيب";
	if (source === "cap") return "من تدريب المعلّم. بلغنا حد غروك لهذه الدقيقة";
	if (source === "offline") return "من تدريب المعلّم. غروك غير متصل الآن";
	if (source === "teacher") return "من تدريب المعلّم مباشرة";
	return "";
}
function TopBar({ title, heard, onHear }) {
	const logout = useRoom((state) => state.logout);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: paper,
				onClick: onHear,
				"aria-pressed": heard,
				children: [heard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-5 w-5" }), "الصوت"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: paper,
				onClick: logout,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-5 w-5" }), "خروج"]
			})]
		})]
	});
}
function Toast() {
	const message = useRoom((state) => state.toast);
	if (!message) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-4 left-1/2 z-30 max-w-sm -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-paper",
		children: message
	});
}
function Meter({ ok, err }) {
	const total = ok + err || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-3 overflow-hidden rounded-full bg-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-gulf",
			style: { width: `${Math.round(100 * ok / total)}%` }
		})
	});
}
function LoginScreen() {
	const ready = useRoom((state) => state.ready);
	const db = useRoom((state) => state.db);
	const loginStudent = useRoom((state) => state.loginStudent);
	const registerStudent = useRoom((state) => state.registerStudent);
	const loginTeacher = useRoom((state) => state.loginTeacher);
	const createTeacher = useRoom((state) => state.createTeacher);
	const [role, setRole] = (0, import_react.useState)("sup");
	const [name, setName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function run(task) {
		if (!ready || pending) return;
		setPending(true);
		setError("");
		const message = await task();
		if (message) setError(message);
		setPending(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `${card} flex flex-col items-center gap-3 text-center`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Falcon, { className: "h-44 w-36" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-gulf",
						children: "للعرض أمام اللجنة · نفس هذا الجهاز"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-bold",
						children: "صُقَيْر"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-mist",
						children: "صقر كويتي صغير لا يعلّم مكان المعلّم. المعلّم يدرّبه كل يوم، والطفل يسمع ويرسم ويلعب."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `${card} border-gulf text-start sm:col-span-1`,
						disabled: !ready || pending,
						onClick: () => void run(() => loginTeacher(DEMO.sup.name, DEMO.sup.password)),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mb-2 h-6 w-6 text-gulf" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-gulf",
								children: "ابدأ من هنا"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xl font-bold",
								children: ["المعلّمة ", DEMO.sup.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-mist",
								dir: "ltr",
								children: DEMO.sup.password
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `${card} text-start`,
						disabled: !ready || pending,
						onClick: () => void run(() => loginStudent(DEMO.nora.name, DEMO.nora.password)),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "mb-2 h-6 w-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xl font-bold",
								children: ["الطالبة ", DEMO.nora.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-mist",
								children: "تحتاج الباء والستة"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-mist",
								dir: "ltr",
								children: DEMO.nora.password
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `${card} text-start`,
						disabled: !ready || pending,
						onClick: () => void run(() => loginStudent(DEMO.salem.name, DEMO.salem.password)),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "mb-2 h-6 w-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xl font-bold",
								children: ["الطالب ", DEMO.salem.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-mist",
								children: "يتقدّم بثبات"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-mist",
								dir: "ltr",
								children: DEMO.salem.password
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: role === "sup" ? clay : paper,
							onClick: () => setRole("sup"),
							children: "دخول المعلّم"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: role === "stu" ? clay : paper,
							onClick: () => setRole("stu"),
							children: "دخول الطالب"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							if (role === "sup") run(() => db.sup ? loginTeacher(name, password) : createTeacher(name, password));
							else run(() => loginStudent(name, password));
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-mist",
									children: role === "sup" ? "اسم المعلّم" : "اسم مستعار، لا الاسم الكامل"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: name,
									onChange: (event) => setName(event.target.value),
									autoComplete: "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-mist",
									children: "كلمة المرور"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									type: "password",
									value: password,
									onChange: (event) => setPassword(event.target.value),
									autoComplete: "off"
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-clay",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: gulf,
									type: "submit",
									disabled: !ready || pending,
									children: pending ? "نتحقق…" : "دخول"
								}), role === "stu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: paper,
									type: "button",
									disabled: !ready || pending,
									onClick: () => void run(() => registerStudent(name, password)),
									children: "حساب طالب جديد"
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-mist",
						children: !ready ? "نجهّز صف العرض وكلمات المرور المشفّرة…" : "كلمة المرور تُشتق بـ PBKDF2 ولا تُحفظ كنص. بيانات الطالب يراها هو والمعلّم فقط على هذا الجهاز. لا تُدخل اسم طفل حقيقي."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 text-mist",
				children: "مستلهم من روح فيلم كل طفل نجم: المعلّم يرفض أن يسمّي الطفل كسولًا، والحرف يُرسم باليد، والإيقاع يثبت الصوت. صُقَيْر أداة مساندة، لا تشخيص ولا علاج."
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function clip(value, max) {
	return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}
function notesOf$1(value) {
	if (!Array.isArray(value)) return [];
	return value.slice(-8).map((item) => {
		const note = item;
		return {
			topic: clip(note.topic, 24),
			how: clip(note.how, 180),
			say: clip(note.say, 160),
			dialect: clip(note.dialect, 80),
			english: clip(note.english, 32)
		};
	});
}
function parseAsk(input) {
	const raw = input ?? {};
	const voice = raw.voice === "kuwaiti" || raw.voice === "fusha" || raw.voice === "mix" ? raw.voice : "mix";
	const history = Array.isArray(raw.history) ? raw.history.slice(-6).map((item) => {
		const turn = item;
		return {
			role: turn.role === "bird" ? "bird" : "child",
			text: clip(turn.text, 220)
		};
	}) : [];
	return {
		question: clip(raw.question, 400),
		history: history.filter((turn) => turn.text),
		rules: Array.isArray(raw.rules) ? raw.rules.map((rule) => clip(rule, 80)).filter(Boolean).slice(0, 20) : [],
		notes: notesOf$1(raw.notes),
		weak: Array.isArray(raw.weak) ? raw.weak.map((item) => clip(item, 8)).filter(Boolean).slice(0, 6) : [],
		lesson: clip(raw.lesson, 240),
		voice,
		english: Boolean(raw.english),
		child: clip(raw.child, 24)
	};
}
var askBird = createServerFn({ method: "POST" }).validator((input) => parseAsk(input)).handler(createSsrRpc("0e75956390a15183342c6091ff41663ac1bf069f7808a6402823aaf89d16d15f"));
var composeChant = createServerFn({ method: "POST" }).validator((input) => parseAsk(input)).handler(createSsrRpc("2df4f081629719ec00debbc32caa23f9463f7b49bf5ee7c3ac0f4ef742ace8f3"));
var suggestLesson = createServerFn({ method: "POST" }).validator((input) => {
	const raw = input ?? {};
	return {
		symbol: clip(raw.symbol, 8),
		name: clip(raw.name, 24),
		confuses: clip(raw.confuses, 80),
		notes: clip(raw.notes, 400)
	};
}).handler(createSsrRpc("f2426a9a1d0b5dfffad95507970330f58b2cdc13ed55c3fd82a09136110e6332"));
var pingGrok = createServerFn({ method: "POST" }).validator((_input) => ({})).handler(createSsrRpc("3ebe41856cbe333187e02d1c066a9ce62f46da9eca0145a99036095ec9c33098"));
var enabled = true;
function setVoiceEnabled(value) {
	enabled = value;
	if (!value && typeof window !== "undefined") window.speechSynthesis?.cancel();
}
function voiceEnabled() {
	return enabled;
}
function arabicVoice() {
	const voices = window.speechSynthesis.getVoices();
	return voices.find((item) => item.lang.toLowerCase().startsWith("ar-sa")) ?? voices.find((item) => item.lang.toLowerCase().startsWith("ar"));
}
function speak(text) {
	const spoken = text.replace(/[\u064B-\u0652]/g, "");
	return new Promise((resolve) => {
		if (!enabled || typeof window === "undefined" || !window.speechSynthesis || !spoken.trim()) {
			resolve();
			return;
		}
		try {
			const utter = new SpeechSynthesisUtterance(spoken);
			utter.lang = "ar-SA";
			utter.rate = .82;
			const voice = arabicVoice();
			if (voice) utter.voice = voice;
			utter.onend = () => resolve();
			utter.onerror = () => resolve();
			window.speechSynthesis.cancel();
			window.speechSynthesis.speak(utter);
		} catch {
			resolve();
		}
	});
}
if (typeof window !== "undefined") window.speechSynthesis?.addEventListener("voiceschanged", () => {
	window.speechSynthesis.getVoices();
});
function listen(onText, onFail) {
	if (typeof window === "undefined") {
		onFail();
		return;
	}
	const host = window;
	const Ctor = host.SpeechRecognition || host.webkitSpeechRecognition;
	if (!Ctor) {
		onFail();
		return;
	}
	const recog = new Ctor();
	recog.lang = "ar-KW";
	recog.onresult = (event) => {
		const text = event.results[0]?.[0]?.transcript?.trim() ?? "";
		if (text) onText(text);
		else onFail();
	};
	recog.onerror = () => onFail();
	try {
		recog.start();
	} catch {
		onFail();
	}
}
function clap(times = 1) {
	if (typeof window === "undefined") return;
	const Ctx = window.AudioContext || window.webkitAudioContext;
	if (!Ctx) return;
	const ctx = new Ctx();
	for (let i = 0; i < times; i++) {
		const start = ctx.currentTime + i * .42;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(150, start);
		gain.gain.setValueAtTime(1e-4, start);
		gain.gain.exponentialRampToValueAtTime(.18, start + .012);
		gain.gain.exponentialRampToValueAtTime(1e-4, start + .09);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(start);
		osc.stop(start + .1);
	}
	window.setTimeout(() => void ctx.close(), times * 480 + 200);
}
var TABS = [
	{
		id: "talk",
		label: "كلّم صُقَيْر"
	},
	{
		id: "chant",
		label: "أنشودة"
	},
	{
		id: "trace",
		label: "أرسم"
	},
	{
		id: "play",
		label: "ألعب"
	},
	{
		id: "stars",
		label: "نجومي"
	}
];
var NUMS = [
	{
		n: 6,
		answer: "٦",
		options: [
			"٦",
			"٩",
			"٥"
		]
	},
	{
		n: 9,
		answer: "٩",
		options: [
			"٩",
			"٦",
			"٨"
		]
	},
	{
		n: 2,
		answer: "٢",
		options: [
			"٢",
			"٣",
			"٥"
		]
	},
	{
		n: 3,
		answer: "٣",
		options: [
			"٣",
			"٢",
			"٨"
		]
	},
	{
		n: 5,
		answer: "٥",
		options: [
			"٥",
			"٠",
			"٨"
		]
	},
	{
		n: 8,
		answer: "٨",
		options: [
			"٨",
			"٠",
			"٣"
		]
	}
];
var PENS = [
	{
		id: "ink",
		label: "حبر",
		token: "--color-ink"
	},
	{
		id: "gulf",
		label: "أخضر",
		token: "--color-gulf"
	},
	{
		id: "clay",
		label: "طين",
		token: "--color-clay"
	}
];
function newBlock() {
	const word = WORDS[Math.floor(Math.random() * WORDS.length)] ?? "نجم";
	return {
		word,
		placed: "",
		pool: shuffle([...word].map((l) => ({
			l,
			used: false
		}))),
		done: false
	};
}
function deal() {
	const letters = shuffle(Object.keys(INITIAL)).slice(0, 3);
	return shuffle(letters.flatMap((letter) => [{
		id: `${letter}-a`,
		letter,
		shown: letter,
		kind: "full",
		open: false,
		done: false
	}, {
		id: `${letter}-b`,
		letter,
		shown: INITIAL[letter] ?? letter,
		kind: "form",
		open: false,
		done: false
	}]));
}
function StudentView() {
	const me = useRoom((state) => state.me);
	const db = useRoom((state) => state.db);
	const [tab, setTab] = (0, import_react.useState)("talk");
	const [heard, setHeard] = (0, import_react.useState)(voiceEnabled());
	const name = me?.name ?? "";
	const user = db.users[name];
	function toggleVoice() {
		const next = !voiceEnabled();
		setVoiceEnabled(next);
		setHeard(next);
		if (next) speak("الصوت يعمل");
	}
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh max-w-3xl px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
				title: `أهلًا ${name}`,
				heard,
				onHear: toggleVoice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Falcon, { className: "h-20 w-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-mist",
					children: "أنا صُقَيْر. معلّمك علّمني. اسألني، أو المس الحرف بإصبعك."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex flex-wrap gap-2",
				children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tab === item.id ? clay : paper,
					onClick: () => setTab(item.id),
					children: item.label
				}, item.id))
			}),
			tab === "talk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Talk, { name }) : null,
			tab === "chant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chant, { name }) : null,
			tab === "trace" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trace, { name }) : null,
			tab === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { name }) : null,
			tab === "stars" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { name }) : null
		]
	});
}
function notesOf(db) {
	return db.notes.slice(-8).map(({ topic, how, say, dialect, english }) => ({
		topic,
		how,
		say,
		dialect,
		english
	}));
}
function Talk({ name }) {
	const db = useRoom((state) => state.db);
	const addLog = useRoom((state) => state.addLog);
	const notify = useRoom((state) => state.notify);
	const [chat, setChat] = (0, import_react.useState)([]);
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const data = db.users[name]?.data;
	async function send(raw) {
		const question = raw.trim();
		if (!question || busy || !data) return;
		const history = chat.slice(-6).map((item) => ({
			role: item.role,
			text: item.text
		}));
		const weak = ranked(data.quiz).filter((item) => item.err > 0).slice(0, 6).map((item) => item.id);
		setChat((items) => [...items, {
			role: "child",
			text: question
		}]);
		setText("");
		setBusy(true);
		try {
			const result = await askBird({ data: {
				question,
				history,
				rules: db.rules,
				notes: notesOf(db),
				weak,
				lesson: db.lesson,
				voice: db.voice,
				english: db.english,
				child: name
			} });
			setChat((items) => [...items, {
				role: "bird",
				text: result.text,
				source: result.source
			}]);
			if (result.refused) addLog(name, question);
			speak(result.text);
		} catch {
			const line = teacherReply(question, notesOf(db), db.voice, db.english);
			setChat((items) => [...items, {
				role: "bird",
				text: line,
				source: "offline"
			}]);
			speak(line);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `${card} grid gap-3`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-sand p-3",
				children: [
					"أهلًا ",
					name,
					". أنا صُقَيْر. ماذا نتعلّم اليوم؟",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `${paper} mt-2`,
						onClick: () => void speak(`أهلًا ${name}. أنا صقير. ماذا نتعلم اليوم؟`),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" }), "اسمع"]
					})
				]
			}),
			chat.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: item.role === "child" ? "me-auto w-11/12 rounded-2xl bg-gulf p-3 text-gulf-ink" : "ms-auto w-11/12 rounded-2xl border-2 border-line bg-sand p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.text }), item.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-mist",
					children: sourceLabel(item.source)
				}) : null]
			}, `${item.role}-${index}`)),
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-mist",
				children: "صُقَيْر يفكّر…"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-clay text-clay-ink",
				onClick: () => {
					notify("تكلّم الآن");
					listen((heard) => void send(heard), () => notify("لم أسمع. اكتب السؤال تحت."));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "تكلّم"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					send(text);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: text,
					onChange: (event) => setText(event.target.value),
					placeholder: "أو اكتب، وهذا للأهل"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: gulf,
					type: "submit",
					disabled: busy,
					children: "إرسال"
				})]
			})
		]
	});
}
function Chant({ name }) {
	const db = useRoom((state) => state.db);
	const addLog = useRoom((state) => state.addLog);
	const saveChant = useRoom((state) => state.saveChant);
	const notify = useRoom((state) => state.notify);
	const [topic, setTopic] = (0, import_react.useState)("الباء");
	const [lines, setLines] = (0, import_react.useState)([]);
	const [source, setSource] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const data = db.users[name]?.data;
	async function make(raw) {
		const question = raw.trim();
		if (question.length < 2 || busy || !data) return;
		setBusy(true);
		setLines([]);
		const weak = ranked(data.quiz).filter((item) => item.err > 0).slice(0, 6).map((item) => item.id);
		try {
			const result = await composeChant({ data: {
				question,
				history: [],
				rules: db.rules,
				notes: notesOf(db),
				weak,
				lesson: db.lesson,
				voice: db.voice,
				english: false,
				child: name
			} });
			setLines(result.lines);
			setSource(result.source);
			if (result.refused) addLog(name, question);
			else saveChant(name, question);
			play(result.lines);
		} catch {
			notify("تعذّر التأليف. جرّب مرة أخرى");
		} finally {
			setBusy(false);
		}
	}
	async function play(rows) {
		for (const line of rows) {
			clap(1);
			await speak(line);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: card,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-2xl font-bold",
					children: "ما الذي يصعب عليك؟"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: topic,
					onChange: (event) => setTopic(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: clay,
						onClick: () => {
							notify("تكلّم الآن");
							listen((heard) => {
								setTopic(heard);
								make(heard);
							}, () => notify("لم أسمع. اكتب ما يصعب."));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-5 w-5" }), "تكلّم"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: gulf,
						disabled: busy,
						onClick: () => void make(topic),
						children: busy ? "أؤلّف…" : "ألّف أنشودة"
					})]
				})
			]
		}), lines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `${card} grid gap-2`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Falcon, { className: "h-24 w-20" }),
				lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xl",
					children: line
				}, line)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: paper,
					onClick: () => void play(lines),
					children: "صفّق وردّد"
				}),
				source ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-mist",
					children: sourceLabel(source)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-mist",
					children: "ردّدها مع التصفيق. بلا موسيقى."
				})
			]
		}) : null]
	});
}
function Trace({ name }) {
	const saveDraw = useRoom((state) => state.saveDraw);
	const notify = useRoom((state) => state.notify);
	const canvasRef = (0, import_react.useRef)(null);
	const penRef = (0, import_react.useRef)("ink");
	const [glyphId, setGlyphId] = (0, import_react.useState)("ب");
	const [pen, setPen] = (0, import_react.useState)("ink");
	const glyph = glyphOf(glyphId);
	const idea = glyph ? `لنحضر ${glyph.material} ونرسم «${glyph.name}». ${glyph.air}` : "";
	(0, import_react.useEffect)(() => {
		penRef.current = pen;
	}, [pen]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		paintBoard(ctx, glyphId);
		let drawing = false;
		const point = (event) => {
			const rect = canvas.getBoundingClientRect();
			return [(event.clientX - rect.left) * 340 / rect.width, (event.clientY - rect.top) * 255 / rect.height];
		};
		const color = () => getComputedStyle(document.documentElement).getPropertyValue(PENS.find((item) => item.id === penRef.current)?.token ?? "--color-ink").trim();
		const down = (event) => {
			drawing = true;
			const [x, y] = point(event);
			ctx.strokeStyle = color();
			ctx.lineWidth = 8;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(x ?? 0, y ?? 0);
			canvas.setPointerCapture(event.pointerId);
		};
		const move = (event) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: card,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-2xl font-bold",
				children: "اختر حرفًا أو رقمًا"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: GLYPHS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${item.id === glyphId ? clay : paper} min-w-11 px-3 text-2xl`,
					onClick: () => {
						setGlyphId(item.id);
						speak(item.name);
					},
					children: item.id
				}, item.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: card,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-semibold",
					children: idea
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					width: 340,
					height: 255,
					className: "aspect-[4/3] w-full max-w-sm touch-none rounded-card border-2 border-line bg-paper"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						PENS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": item.label,
							"aria-pressed": pen === item.id,
							className: `h-11 w-11 rounded-full border-2 ${pen === item.id ? "border-ink" : "border-line"} ${item.id === "ink" ? "bg-ink" : item.id === "gulf" ? "bg-gulf" : "bg-clay"}`,
							onClick: () => setPen(item.id)
						}, item.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: paper,
							onClick: () => {
								const ctx = canvasRef.current?.getContext("2d");
								if (ctx) paintBoard(ctx, glyphId);
							},
							children: "مسح"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: gulf,
							onClick: () => {
								const url = canvasRef.current?.toDataURL("image/jpeg", .55);
								if (!url) return;
								saveDraw(name, glyphId, url);
								notify("حُفظت رسمتك في معرض النجوم");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-5 w-5" }), "حفظ"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: paper,
							onClick: () => void speak(glyph?.name ?? glyphId),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" }), "اسمه"]
						})
					]
				})
			]
		})]
	});
}
function paintBoard(ctx, glyphId) {
	ctx.fillStyle = "#fffaf3";
	ctx.fillRect(0, 0, 340, 255);
	ctx.fillStyle = "rgba(15, 110, 98, 0.2)";
	ctx.font = "bold 180px Tahoma, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(glyphId, 170, 132);
}
function Play({ name }) {
	const [mode, setMode] = (0, import_react.useState)("word");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: mode === "word" ? clay : paper,
						onClick: () => setMode("word"),
						children: "مكعبات الكلمة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: mode === "num" ? clay : paper,
						onClick: () => setMode("num"),
						children: "عدّ النقاط"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: mode === "form" ? clay : paper,
						onClick: () => setMode("form"),
						children: "شكل الحرف"
					})
				]
			}),
			mode === "word" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordGame, { name }) : null,
			mode === "num" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumGame, { name }) : null,
			mode === "form" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormGame, { name }) : null
		]
	});
}
function WordGame({ name }) {
	const record = useRoom((state) => state.record);
	const notify = useRoom((state) => state.notify);
	const [block, setBlock] = (0, import_react.useState)(newBlock);
	function pick(index) {
		const tile = block.pool[index];
		if (!tile || tile.used || block.done) return;
		const need = [...block.word][block.placed.length] ?? "";
		if (tile.l !== need) {
			record(name, need, false);
			notify("جرّب حرفًا آخر");
			speak("جرّب حرفًا آخر");
			return;
		}
		const placed = block.placed + tile.l;
		const done = placed === block.word;
		setBlock({
			...block,
			placed,
			done,
			pool: block.pool.map((item, i) => i === index ? {
				...item,
				used: true
			} : item)
		});
		record(name, tile.l, true);
		speak(done ? block.word : tile.l);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${card} text-center`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-2xl font-bold",
				children: "اسمع ثم رتّب"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: gulf,
				onClick: () => void speak(block.word),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" }), "اسمع الكلمة"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-4 flex flex-wrap justify-center gap-2",
				children: [...block.word].map((letter, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-16 w-14 items-center justify-center border-b-4 border-clay text-4xl",
					children: block.placed[index] ?? ""
				}, `${letter}-${index}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: block.pool.map((tile, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${tile.used ? paper : gulf} min-w-14 text-3xl`,
					disabled: tile.used,
					onClick: () => pick(index),
					children: tile.l
				}, `${tile.l}-${index}`))
			}),
			block.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `${paper} mt-4`,
				onClick: () => setBlock(newBlock()),
				children: "كلمة جديدة"
			}) : null
		]
	});
}
function NumGame({ name }) {
	const record = useRoom((state) => state.record);
	const [round, setRound] = (0, import_react.useState)(NUMS[0] ?? {
		n: 6,
		answer: "٦",
		options: [
			"٦",
			"٩",
			"٥"
		]
	});
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		speak(glyphOf(round.answer)?.name ?? "");
	}, [round]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${card} text-center`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-2xl font-bold",
				children: "عدّ ثم المس الرقم"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto my-4 flex max-w-xs flex-wrap justify-center gap-3",
				children: Array.from({ length: round.n }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-8 w-8 rounded-full bg-gulf" }, index))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: round.options.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${gulf} min-w-16 text-3xl`,
					onClick: () => {
						const ok = id === round.answer;
						record(name, round.answer, ok);
						setNote(ok ? "أحسنت" : glyphOf(round.answer)?.shape ?? "انظر مرة أخرى");
						speak(ok ? "أحسنت" : "انظر مرة أخرى");
					},
					children: id
				}, id))
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-semibold",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `${paper} mt-3`,
				onClick: () => {
					setNote("");
					setRound(NUMS[Math.floor(Math.random() * NUMS.length)] ?? round);
				},
				children: "رقم جديد"
			})
		]
	});
}
function FormGame({ name }) {
	const record = useRoom((state) => state.record);
	const notify = useRoom((state) => state.notify);
	const [cards, setCards] = (0, import_react.useState)(deal);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [lock, setLock] = (0, import_react.useState)(false);
	const done = cards.every((card) => card.done);
	function flip(index) {
		if (lock || cards[index]?.open || cards[index]?.done) return;
		const next = [...picked, index];
		setCards(cards.map((card, i) => i === index ? {
			...card,
			open: true
		} : card));
		setPicked(next);
		speak(cards[index]?.letter ?? "");
		if (next.length < 2) return;
		const first = cards[next[0] ?? 0];
		const second = cards[next[1] ?? 0];
		if (!first || !second) return;
		const match = first.letter === second.letter && first.kind !== second.kind;
		setLock(true);
		window.setTimeout(() => {
			setCards((current) => current.map((card, i) => {
				if (!next.includes(i)) return card;
				return match ? {
					...card,
					done: true,
					open: true
				} : {
					...card,
					open: false
				};
			}));
			setPicked([]);
			setLock(false);
			if (match) record(name, first.letter, true);
			else {
				record(name, first.letter, false);
				if (second.letter !== first.letter) record(name, second.letter, false);
			}
			speak(match ? "أحسنت" : "جرّب مرة أخرى");
			if (!match) notify("طابق الحرف مع شكله في أول الكلمة");
		}, 700);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${card} text-center`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-2xl font-bold",
				children: "طابق الحرف مع شكله أول الكلمة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: cards.map((cardFace, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${cardFace.done ? gulf : cardFace.open ? clay : paper} h-20 w-20 text-3xl`,
					onClick: () => flip(index),
					children: cardFace.open || cardFace.done ? cardFace.shown : "؟"
				}, cardFace.id))
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `${paper} mt-4`,
				onClick: () => setCards(deal()),
				children: "لعبة جديدة"
			}) : null
		]
	});
}
function Stars({ name }) {
	const db = useRoom((state) => state.db);
	const savePhoto = useRoom((state) => state.savePhoto);
	const notify = useRoom((state) => state.notify);
	const user = db.users[name];
	const [gate, setGate] = (0, import_react.useState)(false);
	const [password, setPassword] = (0, import_react.useState)("");
	const [caption, setCaption] = (0, import_react.useState)("");
	if (!user) return null;
	const data = user.data;
	const score = accuracy(data.quiz);
	const filled = Math.min(5, data.draws.length + data.chants.length + (score !== null && score >= 60 ? 1 : 0));
	const rows = ranked(data.quiz);
	async function unlock() {
		if (await hashPassword(password, user.salt) !== user.hash) {
			notify("كلمة المرور غير صحيحة");
			return;
		}
		setGate(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: card,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-2 flex items-center gap-2 text-2xl font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-6 w-6 text-clay" }), "نجومي"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex gap-1",
					children: Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-7 w-7 ${index < filled ? "fill-clay text-clay" : "text-line"}` }, index))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"أناشيد: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: data.chants.length }),
					" · رسومات: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: data.draws.length }),
					" · الدقة:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: score === null ? "—" : `${score}%` })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-mist",
					children: "كل رسمة نجم. لست مطالبًا أن تشبه غيرك."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2",
					children: rows.length ? rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: row.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-mist",
							children: [
								row.ok,
								" صواب · ",
								row.err,
								" محاولة"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						ok: row.ok,
						err: row.err
					})] }, row.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-mist",
						children: "العب لتظهر الحروف هنا."
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: card,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-2xl font-bold",
					children: "إنجاز اليوم"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-mist",
					children: "قسم للأهل. صوّروا أجمل حرف رسمه الطفل اليوم. الطفل لا يفتحه وحده."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex gap-2 overflow-x-auto",
					children: [data.photos.map((photo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: photo.u,
							alt: "",
							className: "h-28 w-24 rounded-2xl border-2 border-line object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "text-center text-sm",
							children: photo.l
						})]
					}, photo.t)), data.draws.map((draw) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: draw.u,
						alt: "",
						className: "h-28 w-24 shrink-0 rounded-2xl border-2 border-line object-cover"
					}, draw.t))]
				}),
				gate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: caption,
						onChange: (event) => setCaption(event.target.value),
						placeholder: "ما الحرف الذي نتباهى به؟"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							if (file.size > 6e6) {
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
								savePhoto(name, caption || "حرف اليوم", canvas.toDataURL("image/jpeg", .6));
								setGate(false);
								notify("حُفظ الإنجاز");
							};
							image.src = URL.createObjectURL(file);
						}
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						unlock();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						type: "password",
						value: password,
						onChange: (event) => setPassword(event.target.value),
						placeholder: "كلمة مرور الطالب",
						autoComplete: "off"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: paper,
						type: "submit",
						children: "قسم الأهل"
					})]
				})
			]
		})]
	});
}
var VOICES = [
	{
		id: "fusha",
		label: "فصحى"
	},
	{
		id: "mix",
		label: "مزيج"
	},
	{
		id: "kuwaiti",
		label: "كويتية"
	}
];
var PAIRS = [
	[
		"ب",
		"ت",
		"ث"
	],
	[
		"ج",
		"ح",
		"خ"
	],
	["٦", "٩"],
	["٢", "٣"],
	["٠", "٥"]
];
function TeacherView() {
	const me = useRoom((state) => state.me);
	const db = useRoom((state) => state.db);
	const [tab, setTab] = (0, import_react.useState)("class");
	const [heard, setHeard] = (0, import_react.useState)(voiceEnabled());
	const seed = glyphOf("ب");
	const saved = [...db.notes].reverse().find((item) => item.topic === "ب");
	const [sel, setSel] = (0, import_react.useState)("ب");
	const [how, setHow] = (0, import_react.useState)(saved?.how || seed?.steps.join(" ") || "");
	const [say, setSay] = (0, import_react.useState)(saved?.say || seed?.child || "");
	const [dialect, setDialect] = (0, import_react.useState)(saved?.dialect || seed?.dialect || "");
	const [en, setEn] = (0, import_react.useState)(saved?.english || seed?.en || "");
	function fill(id) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh max-w-3xl px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
				title: `لوحة ${me?.name ?? "المعلّم"}`,
				heard,
				onHear: toggleVoice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-mist",
				children: "صُقَيْر لا يقرّر. المعلّم يدرّبه، وهو يردّد الطريقة."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: tab === "class" ? clay : paper,
						onClick: () => setTab("class"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" }), " الصف"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: tab === "train" ? clay : paper,
						onClick: () => setTab("train"),
						children: "تدريب"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: tab === "method" ? clay : paper,
						onClick: () => setTab("method"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-5 w-5" }), " الطريقة"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: tab === "rules" ? clay : paper,
						onClick: () => setTab("rules"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" }), " المحاذير"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: tab === "show" ? clay : paper,
						onClick: () => setTab("show"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, { className: "h-5 w-5" }), " المعرض"]
					})
				]
			}),
			tab === "class" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassTab, {}) : null,
			tab === "train" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainTab, {
				sel,
				how,
				say,
				dialect,
				en,
				onHow: setHow,
				onSay: setSay,
				onDialect: setDialect,
				onEn: setEn,
				onPick: fill
			}) : null,
			tab === "method" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodTab, {
				sel,
				onPick: (id) => {
					fill(id);
				},
				onUse: (id) => {
					fill(id);
					setTab("train");
				}
			}) : null,
			tab === "rules" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesTab, {}) : null,
			tab === "show" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShowTab, {}) : null
		]
	});
}
function ClassTab() {
	const db = useRoom((state) => state.db);
	const notify = useRoom((state) => state.notify);
	const resetDemo = useRoom((state) => state.resetDemo);
	const [open, setOpen] = (0, import_react.useState)("نورة");
	const [online, setOnline] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const names = Object.keys(db.users);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-2xl font-bold",
						children: "سيناريو العرض، ثلاث دقائق"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "grid list-decimal gap-2 pr-5 text-base",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ابدأ من هنا: نورة تخلط الباء، والستة ذيلها ينقلب." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "افتح «الطريقة» ثم «تدريب». عدّل جملة صُقَيْر واحفظها. بدّل الصوت." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "افحص غروك. اخرج وادخل نورة. اسأل: كيف أكتب الباء؟" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "أنشودة، رسم بالإصبع، ثم لعبة. ارجع: المعرض والسجل يتحدّثان عن الدرس." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-mist",
						children: "كل الحسابات على هذا الجهاز. بدّل بينها من زر الخروج."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${paper} mt-3`,
						onClick: () => {
							setOnline("نفحص…");
							pingGrok({ data: {} }).then((result) => {
								const line = result.online ? "غروك متصل. تدريب المعلّمة يصل إليه." : "غروك غير متصل. صُقَيْر يجيب من تدريبك المحفوظ.";
								setOnline(line);
								notify(line);
							});
						},
						children: "افحص غروك"
					}),
					online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-semibold",
						children: online
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Falcon, { className: "h-20 w-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-2xl font-bold",
						children: [
							"الطلاب (",
							names.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-mist",
						children: [
							"صوت صُقَيْر: ",
							VOICES.find((item) => item.id === db.voice)?.label,
							" · الإنجليزية ",
							db.english ? "مرة واحدة" : "مغلقة"
						]
					})] })]
				}), names.map((student) => {
					const rec = db.users[student];
					if (!rec) return null;
					const score = accuracy(rec.data.quiz);
					const weak = ranked(rec.data.quiz).filter((item) => item.err > 0).slice(0, 3);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t-2 border-line py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: student }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-mist",
								children: [
									"دقة ",
									score === null ? "—" : `${score}%`,
									" · رسوم ",
									rec.data.draws.length,
									" · أناشيد ",
									rec.data.chants.length
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: paper,
								onClick: () => setOpen(open === student ? null : student),
								children: "تفاصيل"
							})]
						}), open === student ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							name: student,
							weak: weak.map((item) => item.id)
						}) : null]
					}, student);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: paper,
				onClick: () => {
					if (!confirm) {
						setConfirm(true);
						return;
					}
					resetDemo();
				},
				children: confirm ? "تأكيد استرجاع صف العرض" : "استرجاع صف العرض"
			})
		]
	});
}
function Detail({ name, weak }) {
	const db = useRoom((state) => state.db);
	const resetStudentPassword = useRoom((state) => state.resetStudentPassword);
	const deleteStudent = useRoom((state) => state.deleteStudent);
	const notify = useRoom((state) => state.notify);
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const rec = db.users[name];
	if (!rec) return null;
	const chants = rec.data.chants.slice(-4).map((item) => item.x).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 grid gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["يحتاج دعمًا: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: weak.join(" ، ") || "لا شيء واضح بعد" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-mist",
				children: ["طلب في الأناشيد: ", chants || "—"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto",
				children: [...rec.data.draws, ...rec.data.photos].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.u,
					alt: "",
					className: "h-24 w-20 shrink-0 rounded-2xl border-2 border-line object-cover"
				}, item.t))
			}),
			ranked(rec.data.quiz).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xl",
				children: row.id
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
				ok: row.ok,
				err: row.err
			})] }, row.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				dir: "ltr",
				type: "password",
				value: password,
				autoComplete: "off",
				placeholder: "كلمة مرور جديدة للطالب",
				onChange: (event) => setPassword(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: gulf,
					onClick: () => {
						resetStudentPassword(name, password).then((error) => notify(error ?? "تغيّرت كلمة المرور"));
					},
					children: "إعادة التعيين"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${btnDanger}`,
					onClick: () => {
						if (!confirm) {
							setConfirm(true);
							return;
						}
						deleteStudent(name);
					},
					children: confirm ? "تأكيد الحذف" : "حذف الطالب وبياناته"
				})]
			})
		]
	});
}
var btnDanger = "inline-flex min-h-11 items-center justify-center rounded-2xl bg-clay px-4 py-2 font-semibold text-clay-ink";
function TrainTab({ sel, how, say, dialect, en, onHow, onSay, onDialect, onEn, onPick }) {
	const db = useRoom((state) => state.db);
	const setVoice = useRoom((state) => state.setVoice);
	const setEnglish = useRoom((state) => state.setEnglish);
	const setLesson = useRoom((state) => state.setLesson);
	const addNote = useRoom((state) => state.addNote);
	const removeNote = useRoom((state) => state.removeNote);
	const notify = useRoom((state) => state.notify);
	const [lesson, setLessonText] = (0, import_react.useState)(db.lesson);
	const [drafting, setDrafting] = (0, import_react.useState)(false);
	const glyph = glyphOf(sel);
	async function draft() {
		setDrafting(true);
		try {
			const result = await suggestLesson({ data: {
				symbol: sel,
				name: glyph?.name ?? "",
				confuses: glyph?.confuses ?? "",
				notes: how
			} });
			if (!result.raw) {
				notify("غروك غير متصل. بقيت طريقتك الجاهزة.");
				return;
			}
			const child = result.raw.match(/للطفل:\s*(.+)/)?.[1]?.trim();
			const kuwaiti = result.raw.match(/كويتي:\s*(.+)/)?.[1]?.trim();
			const steps = result.raw.split("\n").map((line) => line.trim()).filter((line) => /^[0-9٠-٩]/.test(line)).map((line) => line.replace(/^[0-9٠-٩]+[.)\-\s]+/, "")).join(" ");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-2xl font-bold",
						children: "صوت صُقَيْر"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [VOICES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: db.voice === item.id ? clay : paper,
							onClick: () => setVoice(item.id),
							children: item.label
						}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: db.english ? clay : paper,
							onClick: () => setEnglish(!db.english),
							children: db.english ? "إنجليزية: مرة" : "إنجليزية: لا"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "درس اليوم الذي يلتزم به" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: lesson,
							onChange: (event) => setLessonText(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${gulf} mt-2`,
						onClick: () => {
							setLesson(lesson);
							notify("حُفظ درس اليوم");
						},
						children: "احفظ درس اليوم"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-2xl font-bold",
						children: "درّب صُقَيْر على رمز"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex flex-wrap gap-2",
						children: GLYPHS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${sel === item.id ? clay : paper} min-w-11 px-3 text-2xl`,
							onClick: () => onPick(item.id),
							children: item.id
						}, item.id))
					}),
					glyph ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-mist",
						children: [
							"يختلط مع ",
							glyph.confuses,
							". المادة المقترحة: ",
							glyph.material,
							"."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: ["طريقتك", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: how,
							onChange: (event) => onHow(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-2 grid gap-1",
						children: ["الجملة التي يقولها للطفل", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: say,
							onChange: (event) => onSay(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-2 grid gap-1",
						children: ["خاتمة كويتية خفيفة", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: dialect,
							onChange: (event) => onDialect(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-2 grid gap-1",
						children: ["الكلمة الإنجليزية مرة واحدة", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: en,
							onChange: (event) => onEn(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: gulf,
							onClick: () => {
								if (!say.trim()) {
									notify("اكتب الجملة التي يقولها صُقَيْر");
									return;
								}
								addNote({
									topic: sel,
									how,
									say,
									dialect,
									english: en
								});
								notify("تعلّم صُقَيْر طريقتك");
								speak(say);
							},
							children: "احفظ تدريب اليوم"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: paper,
							disabled: drafting,
							onClick: () => void draft(),
							children: drafting ? "غروك يكتب مسودة…" : "مسودة من غروك"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-mist",
						children: "لا يُرسل اسم حقيقي ولا صورة. يُرسل التدريب والمحاذير وسؤال الطفل فقط."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xl font-bold",
						children: "ما حفظه صُقَيْر"
					}),
					db.notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-mist",
						children: "لا تدريب بعد."
					}) : null,
					[...db.notes].reverse().map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t-2 border-line py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-2xl",
									children: note.topic
								}),
								" ",
								note.say
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: paper,
								onClick: () => removeNote(note.id),
								children: "حذف"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-mist",
							children: [
								note.dialect,
								" ",
								note.english
							]
						})]
					}, note.id))
				]
			})
		]
	});
}
function MethodTab({ sel, onPick, onUse }) {
	const glyph = glyphOf(sel);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-2xl font-bold",
						children: "كيف أعلّم هذا الرمز"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-mist",
						children: "حركة وصوت ولمس. بلا تشخيص، وبلا تشبيه الحرف بحيوان لا يشبهه."
					}),
					PAIRS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 flex flex-wrap gap-2",
						children: group.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${sel === id ? clay : paper} min-w-14 text-2xl`,
							onClick: () => onPick(id),
							children: id
						}, id))
					}, group.join("-"))),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: "المجموعات التي تتشابه بالنقاط أو بالذيل. باقي الحروف تحت."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: GLYPHS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: sel === item.id ? clay : paper,
							onClick: () => onPick(item.id),
							children: item.id
						}, item.id))
					})
				]
			}),
			glyph ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-3xl font-bold",
						children: [
							glyph.id,
							" · ",
							glyph.name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-clay",
						children: ["يختلط مع ", glyph.confuses]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: glyph.shape
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 grid list-decimal gap-2 pr-5",
						children: glyph.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: step }, step))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3",
						children: ["قل للطفل: ", glyph.child]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-mist",
						children: glyph.dialect
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${gulf} mt-3`,
						onClick: () => onUse(glyph.id),
						children: "انقلي هذا إلى تدريب صُقَيْر"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${paper} mt-2`,
						onClick: () => void speak(`${glyph.name}. ${glyph.child}`),
						children: "اسمع الجملة"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-mist",
				children: "النقطة فرق الباء والتاء والثاء. الذيل فرق الستة والتسعة. هذا دعم داخل الصف، لا يسمّي صعوبة ولا يغني عن المعلّم."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mist",
				children: ["أُسر الحروف: ", FAMILIES.map((family) => family.join(" ")).join(" · ")]
			})
		]
	});
}
function RulesTab() {
	const db = useRoom((state) => state.db);
	const setRules = useRoom((state) => state.setRules);
	const notify = useRoom((state) => state.notify);
	const changeTeacherPassword = useRoom((state) => state.changeTeacherPassword);
	const [text, setText] = (0, import_react.useState)(db.rules.join("\n"));
	const [password, setPassword] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-2xl font-bold",
						children: "قائمة المحاذير"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-mist",
						children: "سطر لكل بند. إن مسّها السؤال فالجواب وحده: اسأل معلّمك، ليس من حقي الإجابة عن ذلك."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: text,
						onChange: (event) => setText(event.target.value),
						rows: 8
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: gulf,
							onClick: () => {
								const rules = text.split("\n").map((line) => line.trim()).filter(Boolean);
								setRules(rules.length ? rules : [...DEFAULT_RULES]);
								notify("حُفظت القائمة");
							},
							children: "حفظ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: paper,
							onClick: () => {
								setText(DEFAULT_RULES.join("\n"));
								setRules([...DEFAULT_RULES]);
								notify("عادت القائمة الأصلية");
							},
							children: "الافتراضي"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-mist",
						children: "حدود السلامة الدنيا تبقى حتى لو قُصّرت القائمة: عنف، ومخدرات، وطلب عنوان أو هاتف."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xl font-bold",
						children: "ما رُفض"
					}),
					db.logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-mist",
						children: "لا شيء بعد."
					}) : null,
					[...db.logs].reverse().slice(0, 12).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "border-t-2 border-line py-2 text-mist",
						children: [
							log.u,
							": ",
							log.q
						]
					}, `${log.t}-${log.q}`))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xl font-bold",
						children: "كلمة مرور المعلّم"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						type: "password",
						value: password,
						autoComplete: "off",
						onChange: (event) => setPassword(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${gulf} mt-2`,
						onClick: () => {
							changeTeacherPassword(password).then((error) => notify(error ?? "تغيّرت كلمة المرور"));
						},
						children: "حفظ"
					})
				]
			})
		]
	});
}
function ShowTab() {
	const db = useRoom((state) => state.db);
	const tiles = Object.entries(db.users).flatMap(([student, rec]) => [...rec.data.draws, ...rec.data.photos].map((item) => ({
		...item,
		student
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: card,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-2xl font-bold",
				children: "معرض النجوم"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-mist",
				children: "كما في نهاية الدرس: كل طفل يعلّق ما رسمته يده، لا درجته."
			}),
			tiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "لا لوحات بعد." }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: tiles.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "rounded-2xl border-2 border-line bg-sand p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.u,
						alt: "",
						className: "aspect-[4/3] w-full rounded-xl object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "mt-1 text-center",
						children: [
							item.student,
							" · ",
							"l" in item ? item.l : ""
						]
					})]
				}, `${item.student}-${item.t}`))
			})
		]
	});
}
function Studio() {
	const ready = useRoom((state) => state.ready);
	const me = useRoom((state) => state.me);
	const boot = useRoom((state) => state.boot);
	(0, import_react.useEffect)(() => {
		boot();
	}, [boot]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!ready || !me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, {}) : me.role === "sup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentView, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, {})] });
}
var SplitComponent = Studio;
//#endregion
export { SplitComponent as component };
