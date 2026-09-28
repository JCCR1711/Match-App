import { MockReservationsGateway } from "@/src/features/reservations/services/MockReservationsGateway";
import type { ReservationsGateway } from "@/src/features/reservations/services/ReservationsGateway";

export const reservationsGateway: ReservationsGateway = new MockReservationsGateway();
