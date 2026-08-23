export const addMinutesToTime = (time: string, minutesToAdd: number) => {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute) || !Number.isFinite(minutesToAdd)) return "--:--";
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
};

export const formatTimeRange = (startTime: string, durationMinutes: number) =>
  `${startTime}–${addMinutesToTime(startTime, durationMinutes)}`;
