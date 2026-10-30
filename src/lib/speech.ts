let enabled = true;

export function setVoiceEnabled(value: boolean) {
  enabled = value;
  if (!value && typeof window !== "undefined") window.speechSynthesis?.cancel();
}

export function voiceEnabled() {
  return enabled;
}

function arabicVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((item) => item.lang.toLowerCase().startsWith("ar-sa")) ??
    voices.find((item) => item.lang.toLowerCase().startsWith("ar"))
  );
}

export function speak(text: string) {
  const spoken = text.replace(/[\u064B-\u0652]/g, "");
  return new Promise<void>((resolve) => {
    if (!enabled || typeof window === "undefined" || !window.speechSynthesis || !spoken.trim()) {
      resolve();
      return;
    }
    try {
      const utter = new SpeechSynthesisUtterance(spoken);
      utter.lang = "ar-SA";
      utter.rate = 0.82;
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

if (typeof window !== "undefined") {
  window.speechSynthesis?.addEventListener("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  });
}

type Recog = {
  lang: string;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};

export function listen(onText: (text: string) => void, onFail: () => void) {
  if (typeof window === "undefined") {
    onFail();
    return;
  }
  const host = window as Window & {
    SpeechRecognition?: new () => Recog;
    webkitSpeechRecognition?: new () => Recog;
  };
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

export function clap(times = 1) {
  if (typeof window === "undefined") return;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  for (let i = 0; i < times; i++) {
    const start = ctx.currentTime + i * 0.42;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.1);
  }
  window.setTimeout(() => void ctx.close(), times * 480 + 200);
}
