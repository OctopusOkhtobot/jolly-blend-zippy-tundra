import { LogOut, Volume2, VolumeX } from "lucide-react";
import { useRoom } from "@/lib/classroom";

export const card = "rounded-card border-2 border-line bg-paper p-4";
export const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-center font-semibold";
export const gulf = `${btn} bg-gulf text-gulf-ink`;
export const paper = `${btn} border-2 border-line bg-paper text-ink`;
export const clay = `${btn} bg-clay text-clay-ink`;

export function Falcon({ className = "h-36 w-28" }: { className?: string }) {
  return (
    <img
      src="/suqayr.jpg"
      alt="صُقَيْر، صقر كويتي صغير"
      className={`${className} rounded-card border-2 border-line object-cover object-top`}
    />
  );
}

export function sourceLabel(source?: string) {
  if (source === "grok") return "قالها صُقَيْر بمساعدة غروك، كما درّبه المعلّم";
  if (source === "guard") return "أوقفه حاجز المحاذير قبل أن يجيب";
  if (source === "cap") return "من تدريب المعلّم. بلغنا حد غروك لهذه الدقيقة";
  if (source === "offline") return "من تدريب المعلّم. غروك غير متصل الآن";
  if (source === "teacher") return "من تدريب المعلّم مباشرة";
  return "";
}

export function TopBar({
  title,
  heard,
  onHear,
}: {
  title: string;
  heard: boolean;
  onHear: () => void;
}) {
  const logout = useRoom((state) => state.logout);
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-2">
        <button type="button" className={paper} onClick={onHear} aria-pressed={heard}>
          {heard ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          الصوت
        </button>
        <button type="button" className={paper} onClick={logout}>
          <LogOut className="h-5 w-5" />
          خروج
        </button>
      </div>
    </div>
  );
}

export function Toast() {
  const message = useRoom((state) => state.toast);
  if (!message) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-30 max-w-sm -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-paper">
      {message}
    </div>
  );
}

export function Meter({ ok, err }: { ok: number; err: number }) {
  const total = ok + err || 1;
  return (
    <div className="h-3 overflow-hidden rounded-full bg-line">
      <div className="h-full bg-gulf" style={{ width: `${Math.round((100 * ok) / total)}%` }} />
    </div>
  );
}
