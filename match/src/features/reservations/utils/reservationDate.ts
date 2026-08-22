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
