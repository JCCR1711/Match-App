import type { ReservationCustomer } from "@/src/features/reservations/types/reservation";

export const reservationCustomers: readonly ReservationCustomer[] = [
  { id: "mock-player-1", displayName: "Josue", email: "jugador@match.demo" },
  { id: "mock-player-2", displayName: "Mateo Valdez", email: "mateo@match.demo" },
  { id: "mock-player-3", displayName: "Valeria Cruz", email: "valeria@match.demo" },
  { id: "mock-player-4", displayName: "Lucía Torres", email: "lucia@match.demo" },
  { id: "mock-player-5", displayName: "José Ramírez", email: "jose@match.demo" },
] as const;
