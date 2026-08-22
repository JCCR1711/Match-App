import {
  BusinessBasicsInput,
  BusinessOnboardingDraft,
  SportsFieldInput,
  UpdateSportsFieldInput,
  VenueLocationInput,
  VenueOnboardingGateway,
} from "@/src/features/venues/types/businessOnboarding";
import { MockBusinessDraftStore } from "./MockBusinessDraftStore";

const wait = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration));

export class MockVenueOnboardingGateway implements VenueOnboardingGateway {
  private draft: BusinessOnboardingDraft | null = null;
  private draftOwnerId: string | null = null;

  constructor(
    private readonly draftStore = new MockBusinessDraftStore(),
  ) {}

  async getBusinessDraft(accessToken: string) {
    await wait(180);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);
    return this.draft;
  }

  async saveBusinessBasics(
    accessToken: string,
    input: BusinessBasicsInput,
  ) {
    await wait(350);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);

    this.draft = {
      organizationId: this.draft?.organizationId ?? `mock-org-${Date.now()}`,
      businessName: input.businessName.trim(),
      contactPhone: input.contactPhone,
      location: this.draft?.location ?? null,
      venues: this.draft?.venues ?? [],
      field: this.draft?.field ?? null,
      fields: this.draft?.fields ?? [],
      nextStep: this.resolveNextStep(
        this.draft?.location ?? null,
        this.draft?.field ?? null,
      ),
    };

    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  async saveVenueLocation(
    accessToken: string,
    organizationId: string,
    input: VenueLocationInput,
  ) {
    await wait(350);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);

    if (!this.draft || this.draft.organizationId !== organizationId) {
      throw new Error("No encontramos el club que estás configurando.");
    }

    const location = {
      venueId: `mock-venue-${Date.now()}`,
      venueName: input.venueName.trim(),
      address: input.address.trim(),
      district: input.district.trim(),
      city: input.city.trim(),
      coordinates: input.coordinates,
      status: input.status,
      defaultSchedule: input.defaultSchedule,
    };
    const venues = [...this.draft.venues, location];

    this.draft = {
      ...this.draft,
      location,
      venues,
      nextStep: this.resolveNextStep(
        {
          venueId: location.venueId,
          venueName: input.venueName,
          address: input.address,
          district: input.district,
          city: input.city,
          coordinates: input.coordinates,
          status: input.status,
          defaultSchedule: input.defaultSchedule,
        },
        this.draft.field,
      ),
      field: this.draft.field,
    };

    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  async saveSportsField(
    accessToken: string,
    organizationId: string,
    input: SportsFieldInput,
  ) {
    await wait(350);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);

    if (
      !this.draft ||
      this.draft.organizationId !== organizationId ||
      !this.draft.location
    ) {
      throw new Error("Primero agrega una sede válida.");
    }

    const venues = this.draft.venues;
    if (!venues.some((venue) => venue.venueId === input.venueId)) {
      throw new Error("Selecciona una sede válida para la cancha.");
    }

    const venue = venues.find((venue) => venue.venueId === input.venueId);
    const effectiveSchedule =
      input.scheduleMode === "custom"
        ? input.scheduleOverride
        : venue?.defaultSchedule ?? null;
    const field = {
      fieldId: `mock-field-${Date.now()}`,
      venueId: input.venueId,
      fieldName: input.fieldName.trim(),
      format: input.format,
      status: input.status,
      scheduleMode: input.scheduleMode,
      scheduleOverride: input.scheduleOverride,
      hourlyPrice: input.hourlyPrice,
      nightHourlyPrice: input.nightHourlyPrice ?? input.hourlyPrice,
      nightStartsAt: input.nightStartsAt ?? "18:00",
      currency: input.currency,
      availability: effectiveSchedule
        ? {
            ...effectiveSchedule,
            hourlyPrice: input.hourlyPrice,
            nightHourlyPrice: input.nightHourlyPrice ?? input.hourlyPrice,
            nightStartsAt: input.nightStartsAt ?? "18:00",
            currency: input.currency,
          }
        : null,
    };
    const fields = [...this.draft.fields, field];

    this.draft = {
      ...this.draft,
      field,
      fields,
      nextStep: "availability",
    };

    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  async deleteSportsField(
    accessToken: string,
    organizationId: string,
    fieldId: string,
  ) {
    await wait(300);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);

    if (
      !this.draft ||
      this.draft.organizationId !== organizationId ||
      !this.draft.fields.some((field) => field.fieldId === fieldId)
    ) {
      throw new Error("No encontramos la cancha que deseas eliminar.");
    }

    const fields = this.draft.fields.filter((field) => field.fieldId !== fieldId);
    this.draft = {
      ...this.draft,
      fields,
      field: fields[0] ?? null,
      nextStep:
        fields.length === 0
          ? "field"
          : fields.some((field) => !field.availability)
            ? "availability"
            : "complete",
    };

    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  async updateSportsField(accessToken: string, organizationId: string, fieldId: string, input: UpdateSportsFieldInput) {
    await wait(300);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);
    if (!this.draft || this.draft.organizationId !== organizationId || !this.draft.fields.some((field) => field.fieldId === fieldId)) throw new Error("No encontramos la cancha.");
    const fields = this.draft.fields.map((field) => {
      if (field.fieldId !== fieldId) return field;
      const venue = this.draft?.venues.find((item) => item.venueId === field.venueId);
      const effectiveSchedule = input.scheduleMode === "custom"
        ? input.scheduleOverride
        : venue?.defaultSchedule ?? null;
      return {
        ...field,
        ...input,
        fieldName: input.fieldName.trim(),
        scheduleOverride: input.scheduleMode === "custom" ? input.scheduleOverride : null,
        availability: effectiveSchedule
          ? {
              ...effectiveSchedule,
              hourlyPrice: input.hourlyPrice,
              nightHourlyPrice: input.nightHourlyPrice ?? input.hourlyPrice,
              nightStartsAt: input.nightStartsAt ?? "18:00",
              currency: field.currency,
            }
          : null,
      };
    });
    this.draft = {
      ...this.draft,
      fields,
      field:
        fields.find((field) => field.fieldId === this.draft?.field?.fieldId) ??
        fields[0] ??
        null,
      nextStep: fields.some((field) => !field.availability)
        ? "availability"
        : "complete",
    };
    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  async deleteVenue(accessToken: string, organizationId: string, venueId: string) {
    await wait(300);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);

    if (!this.draft || this.draft.organizationId !== organizationId || !this.draft.venues.some((venue) => venue.venueId === venueId)) {
      throw new Error("No encontramos la sede que deseas eliminar.");
    }

    const venues = this.draft.venues.filter((venue) => venue.venueId !== venueId);
    const fields = this.draft.fields.filter((field) => field.venueId !== venueId);
    this.draft = {
      ...this.draft,
      venues,
      fields,
      location: venues[0] ?? null,
      field: fields[0] ?? null,
      nextStep: venues.length === 0 ? "location" : fields.length === 0 ? "field" : "complete",
    };
    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  async updateVenueStatus(
    accessToken: string,
    organizationId: string,
    venueId: string,
    status: "active" | "inactive",
  ) {
    await wait(220);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);
    if (!this.draft || this.draft.organizationId !== organizationId) {
      throw new Error("No encontramos el club.");
    }
    const venues = this.draft.venues.map((venue) =>
      venue.venueId === venueId ? { ...venue, status } : venue,
    );
    if (!venues.some((venue) => venue.venueId === venueId)) {
      throw new Error("No encontramos la sede.");
    }
    this.draft = { ...this.draft, venues, location: venues.find((venue) => venue.venueId === this.draft?.location?.venueId) ?? venues[0] ?? null };
    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  async updateFieldStatus(
    accessToken: string,
    organizationId: string,
    fieldId: string,
    status: "active" | "inactive",
  ) {
    await wait(220);
    const ownerId = this.getOwnerId(accessToken);
    await this.hydrateDraft(ownerId);
    if (!this.draft || this.draft.organizationId !== organizationId) {
      throw new Error("No encontramos el club.");
    }
    const fields = this.draft.fields.map((field) =>
      field.fieldId === fieldId ? { ...field, status } : field,
    );
    if (!fields.some((field) => field.fieldId === fieldId)) {
      throw new Error("No encontramos la cancha.");
    }
    this.draft = { ...this.draft, fields, field: fields.find((field) => field.fieldId === this.draft?.field?.fieldId) ?? fields[0] ?? null };
    await this.draftStore.save(ownerId, this.draft);
    return this.draft;
  }

  private async hydrateDraft(ownerId: string) {
    if (this.draftOwnerId !== ownerId) {
      this.draft = await this.draftStore.get(ownerId);
      this.draftOwnerId = ownerId;
    }
  }

  private resolveNextStep(
    location: BusinessOnboardingDraft["location"],
    field: BusinessOnboardingDraft["field"],
  ): BusinessOnboardingDraft["nextStep"] {
    if (!location) {
      return "location";
    }

    if (!field) {
      return "field";
    }

    return field.availability ? "complete" : "availability";
  }

  private getOwnerId(accessToken: string) {
    const tokenBody = accessToken.replace(/^mock-access-/, "");
    const separatorIndex = tokenBody.lastIndexOf(".");
    if (!accessToken.startsWith("mock-access-") || separatorIndex <= 0) {
      throw new Error("La sesión expiró. Ingresa nuevamente.");
    }

    return decodeURIComponent(tokenBody.slice(0, separatorIndex));
  }
}
