export const parseTimeToMinutes = (time: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return hour * 60 + minute;
};

export const getTimeRangeDuration = (startTime: string, endTime: string) => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return null;
  return endMinutes - startMinutes;
};

export const addMinutesToTime = (time: string, minutesToAdd: number) => {
  const startMinutes = parseTimeToMinutes(time);
  if (startMinutes === null || !Number.isFinite(minutesToAdd)) return "--:--";
  const totalMinutes = startMinutes + minutesToAdd;
  return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
};

export const formatTimeRange = (startTime: string, durationMinutes: number) =>
  `${startTime}–${addMinutesToTime(startTime, durationMinutes)}`;
