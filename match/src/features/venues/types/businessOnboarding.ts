export interface BusinessBasicsInput {
  businessName: string;
  contactPhone: string;
}

export interface VenueLocationInput {
  venueName: string;
  address: string;
  district: string;
  city: string;
  coordinates: VenueCoordinates | null;
  status: ResourceStatus;
  defaultSchedule: WeeklySchedule | null;
}

export interface VenueCoordinates {
  latitude: number;
  longitude: number;
}

export interface VenueLocation extends VenueLocationInput {
  venueId: string;
}

export type FieldFormat = "5v5" | "7v7" | "11v11";
export type ResourceStatus = "active" | "inactive";
export type FieldScheduleMode = "inherit" | "custom";

export interface SportsFieldInput {
  venueId: string;
  fieldName: string;
  format: FieldFormat;
  status: ResourceStatus;
  scheduleMode: FieldScheduleMode;
  scheduleOverride: WeeklySchedule | null;
  hourlyPrice: number;
  currency: "PEN";
}

export interface SportsFieldDraft extends SportsFieldInput {
  fieldId: string;
  availability: FieldAvailability | null;
}

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface FieldAvailabilityInput {
  weekdays: Weekday[];
  openingTime: string;
  closingTime: string;
  hourlyPrice: number;
  currency: "PEN";
}

export interface WeeklySchedule {
  weekdays: Weekday[];
  openingTime: string;
  closingTime: string;
}

export type FieldAvailability = FieldAvailabilityInput;

export interface BusinessOnboardingDraft {
  organizationId: string;
  businessName: string;
  contactPhone: string;
  venues: VenueLocation[];
  fields: SportsFieldDraft[];
  /** @deprecated Compatibilidad temporal con el prototipo. Usar venues. */
  location: VenueLocation | null;
  /** @deprecated Compatibilidad temporal con el prototipo. Usar fields. */
  field: SportsFieldDraft | null;
  nextStep: "location" | "field" | "availability" | "complete";
}

export interface VenueOnboardingGateway {
  getBusinessDraft(accessToken: string): Promise<BusinessOnboardingDraft | null>;
  saveBusinessBasics(
    accessToken: string,
    input: BusinessBasicsInput,
  ): Promise<BusinessOnboardingDraft>;
  saveVenueLocation(
    accessToken: string,
    organizationId: string,
    input: VenueLocationInput,
  ): Promise<BusinessOnboardingDraft>;
  saveSportsField(
    accessToken: string,
    organizationId: string,
    input: SportsFieldInput,
  ): Promise<BusinessOnboardingDraft>;
  deleteSportsField(
    accessToken: string,
    organizationId: string,
    fieldId: string,
  ): Promise<BusinessOnboardingDraft>;
  deleteVenue(
    accessToken: string,
    organizationId: string,
    venueId: string,
  ): Promise<BusinessOnboardingDraft>;
  saveFieldAvailability(
    accessToken: string,
    organizationId: string,
    fieldId: string,
    input: FieldAvailabilityInput,
  ): Promise<BusinessOnboardingDraft>;
  updateVenueStatus(
    accessToken: string,
    organizationId: string,
    venueId: string,
    status: ResourceStatus,
  ): Promise<BusinessOnboardingDraft>;
  updateFieldStatus(
    accessToken: string,
    organizationId: string,
    fieldId: string,
    status: ResourceStatus,
  ): Promise<BusinessOnboardingDraft>;
}
