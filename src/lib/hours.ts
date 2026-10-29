import { hours, type DayHours } from "@/content/site";

const TZ = "America/Sao_Paulo";
const DAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export type OpenStatus = { open: boolean; text: string };

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "04:30" -> "4h30", "24:00" -> "meia-noite", "18:00" -> "18h". */
export function formatTime(hhmm: string) {
  if (hhmm === "24:00") return "meia-noite";
  const [h, m] = hhmm.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

/** Weekday (0 = domingo) and minutes since midnight in São Paulo time. */
export function localClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function slotFor(day: number): DayHours | undefined {
  return hours.find((h) => h.days.includes(day));
}

// shortcut: ignores public holidays (no holiday calendar); the holiday hours are shown as text instead.
export function getOpenStatus(date: Date): OpenStatus {
  const { day, minutes } = localClock(date);
  const today = slotFor(day);
  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { open: true, text: `Aberta agora · fecha ${closingPhrase(today.close)}` };
    }
    if (minutes < open) {
      return { open: false, text: `Fechada agora · abre hoje às ${formatTime(today.open)}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    const slot = slotFor(next);
    if (slot) {
      const when = i === 1 ? "amanhã" : DAY_NAMES[next];
      return { open: false, text: `Fechada agora · abre ${when} às ${formatTime(slot.open)}` };
    }
  }
  return { open: false, text: "Consulte os horários" };
}

function closingPhrase(close: string) {
  return close === "24:00" ? "à meia-noite" : `às ${formatTime(close)}`;
}

/** "das 4h30 à meia-noite" style range, without the leading "das". */
export function rangeText(open: string, close: string) {
  return `${formatTime(open)} ${closingPhrase(close)}`;
}

/** Weekday line used in fallbacks and metadata, built from the content file. */
export const weekdayHoursText = `${hours[0].label}, das ${rangeText(hours[0].open, hours[0].close)}`;
