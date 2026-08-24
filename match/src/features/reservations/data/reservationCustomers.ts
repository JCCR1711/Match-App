import type { ReservationCustomer } from "@/src/features/reservations/types/reservation";

export const reservationCustomers: readonly ReservationCustomer[] = [
  { id: "mock-player-1", displayName: "Josue", username: "josue10", email: "jugador@match.demo" },
  { id: "mock-player-2", displayName: "Mateo Valdez", username: "mateov", email: "mateo@match.demo" },
  { id: "mock-player-3", displayName: "Valeria Cruz", username: "valeriacruz", email: "valeria@match.demo" },
  { id: "mock-player-4", displayName: "Lucía Torres", username: "luciatorres", email: "lucia@match.demo" },
  { id: "mock-player-5", displayName: "José Ramírez", username: "jcramirez", email: "jose@match.demo" },
  { id: "mock-player-layout-long", displayName: "María Fernanda Rodríguez de la Torre", username: "mafer.r", email: "maria.fernanda.rodriguez.delatorre@match.demo" },
] as const;
