import type {
  AvailabilityBlock,
  AvailabilityBlockCreateInput,
  ReservationCreateInput,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";

export interface ReservationsSnapshot {
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
  isHydrated: boolean;
}

export const DEMO_RESERVATIONS_ORGANIZATION_ID = "mock-org-mock-venue-owner-1";

export type DevReservationsApiScenario =
  | "normal"
  | "slow"
  | "offline"
  | "server-error"
  | "empty"
  | "conflict"
  | "unauthorized";

export interface ReservationsGateway {
  getSnapshot(organizationId: string): Promise<ReservationsSnapshot>;
  createReservation(input: ReservationCreateInput, organizationId?: string): Promise<ReservationRecord | null>;
  confirmReservation(reservationId: string, organizationId?: string): Promise<ReservationRecord | null>;
  cancelReservation(reservationId: string, organizationId?: string): Promise<ReservationRecord | null>;
  completeRefund(reservationId: string, organizationId?: string): Promise<ReservationRecord | null>;
  createBlock(input: AvailabilityBlockCreateInput, organizationId?: string): Promise<AvailabilityBlock | null>;
  deleteBlock(blockId: string, organizationId?: string): Promise<boolean>;
  getDevScenario?(): Promise<DevReservationsApiScenario>;
  setDevScenario?(scenario: DevReservationsApiScenario): Promise<void>;
}
