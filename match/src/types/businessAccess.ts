export type VenueRole = "owner" | "manager" | "staff";

export interface VenueMembership {
  organizationId: string;
  role: VenueRole;
}
