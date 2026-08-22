import { addDays, formatDateDetail, formatWeekday, toDateKey } from "@/src/features/reservations/utils/reservationDate";

const today = new Date();

export const reservationDates = [0, 1, 2].map((offset) => {
  const date = addDays(today, offset);

  return {
    id: offset === 0 ? "today" : offset === 1 ? "tomorrow" : "day-after-tomorrow",
    dateKey: toDateKey(date),
    label: offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : formatWeekday(date),
    detail: formatDateDetail(date),
  };
});
