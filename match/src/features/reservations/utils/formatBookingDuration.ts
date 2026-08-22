export const formatBookingDuration = (durationMinutes: number) => {
  const hours = durationMinutes / 60;

  if (Number.isInteger(hours)) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  return `${hours.toLocaleString("es-PE", { maximumFractionDigits: 1 })} horas`;
};
