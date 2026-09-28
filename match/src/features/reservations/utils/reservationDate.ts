import type { Weekday } from "@/src/features/venues/types/businessOnboarding";

const MONTH_FORMATTER = new Intl.DateTimeFormat("es-PE", { month: "short" });
const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" });
const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("es-PE", { weekday: "long" });

export const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateDetail = (date: Date) => `${date.getDate()} ${MONTH_FORMATTER.format(date).replace(".", "")}`;

export const formatMonthYear = (date: Date) => {
  const label = MONTH_YEAR_FORMATTER.format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const formatWeekday = (date: Date) => {
  const label = WEEKDAY_FORMATTER.format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const weekdaysByDayIndex: readonly Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

export const getWeekdayFromDateKey = (dateKey: string) => {
  const date = parseDateKey(dateKey);
  return date ? weekdaysByDayIndex[date.getDay()] : null;
};

export const hasAgendaSlotStarted = (
  dateKey: string,
  startTime: string,
  now = new Date(),
) => {
  const date = parseDateKey(dateKey);
  const [hour, minute] = startTime.split(":").map(Number);
  if (
    !date ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) return false;

  date.setHours(hour, minute, 0, 0);
  return date.getTime() <= now.getTime();
};

export const hasAgendaSlotEnded = (
  dateKey: string,
  startTime: string,
  durationMinutes: number,
  now = new Date(),
) => {
  const date = parseDateKey(dateKey);
  const [hour, minute] = startTime.split(":").map(Number);
  if (!date || !Number.isFinite(durationMinutes) || durationMinutes <= 0) return false;
  date.setHours(hour, minute + durationMinutes, 0, 0);
  return date.getTime() <= now.getTime();
};
