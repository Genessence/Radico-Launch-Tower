import { differenceInDays, differenceInSeconds, parseISO } from "date-fns";

export function daysBetween(dateA: string | null, dateB: string | null): number {
  if (!dateA || !dateB) return 0;
  return differenceInDays(parseISO(dateA), parseISO(dateB));
}

export function calculateDelay(plannedEnd: string | null, actualEnd: string | null): number {
  if (!plannedEnd || !actualEnd) return 0;
  return Math.max(0, differenceInDays(parseISO(actualEnd), parseISO(plannedEnd)));
}

export function secondsUntil(dateStr: string | null): number {
  if (!dateStr) return 0;
  return differenceInSeconds(parseISO(dateStr), new Date());
}

export function formatCountdown(totalSeconds: number): string {
  const abs = Math.abs(totalSeconds);
  const d = Math.floor(abs / 86400);
  const h = Math.floor((abs % 86400) / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const sign = totalSeconds < 0 ? "-" : "";
  if (d > 0) return `${sign}${d}d ${h}h ${m}m`;
  if (h > 0) return `${sign}${h}h ${m}m ${s}s`;
  return `${sign}${m}m ${s}s`;
}
