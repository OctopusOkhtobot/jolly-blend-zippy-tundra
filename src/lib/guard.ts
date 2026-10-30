/** Floor the supervisor cannot remove. Child-safety minimum. */
export const FLOOR = [
  "عنف",
  "سلاح",
  "أسلح",
  "دم",
  "جنس",
  "عاطف",
  "مخدر",
  "تدخين",
  "كحول",
  "خمر",
  "سياسي",
  "سياسة",
  "مذهب",
  "أديان",
  "سحر",
  "خراف",
  "عنوان",
  "هاتف",
  "مخيف",
  "مؤذ",
];

const STOP = new Set([
  "موضوع",
  "اطفال",
  "أطفال",
  "تعليم",
  "مجتمع",
  "كويتي",
  "يخالف",
  "قيم",
  "كل",
  "اي",
  "أي",
  "بين",
  "طلب",
  "الا",
  "إلا",
  "عند",
  "هذا",
  "هذه",
  "ذلك",
  "التي",
  "الذي",
  "صور",
  "صورة",
  "معلومات",
  "دول",
  "دولة",
]);

export function ruleTokens(rules: string[]) {
  const out: string[] = [];
  for (const rule of rules) {
    for (const raw of rule.split(/[\s،,./]+/)) {
      const trimmed = raw.replace(/^[وال]+/u, "").replace(/^ال/u, "");
      if (trimmed.length >= 3 && !STOP.has(trimmed) && !STOP.has(raw)) out.push(trimmed);
    }
  }
  return out;
}

export function isForbidden(question: string, rules: string[]) {
  const compact = question.replace(/\s+/g, "");
  if (!compact) return false;
  if (FLOOR.some((word) => compact.includes(word))) return true;
  return ruleTokens(rules).some((word) => compact.includes(word));
}
