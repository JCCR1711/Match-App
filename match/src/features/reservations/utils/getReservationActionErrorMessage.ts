export const getReservationActionErrorMessage = (
  error: unknown,
  fallback: string,
) => error instanceof Error && error.message.trim() ? error.message : fallback;
