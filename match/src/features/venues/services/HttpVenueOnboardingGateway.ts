import {
  BusinessBasicsInput,
  BusinessOnboardingDraft,
  FieldAvailabilityInput,
  SportsFieldInput,
  VenueLocationInput,
  VenueOnboardingGateway,
} from "@/src/features/venues/types/businessOnboarding";

interface ApiErrorResponse {
  message?: string;
}

export class HttpVenueOnboardingGateway implements VenueOnboardingGateway {
  constructor(private readonly baseUrl: string) {}

  async getBusinessDraft(accessToken: string) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/onboarding`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 404) {
      return null;
    }

    return this.readDraftResponse(response);
  }

  async saveBusinessBasics(
    accessToken: string,
    input: BusinessBasicsInput,
  ) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/onboarding/business`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

    return this.readDraftResponse(response);
  }

  async saveVenueLocation(
    accessToken: string,
    organizationId: string,
    input: VenueLocationInput,
  ) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/${organizationId}/venues`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

    return this.readDraftResponse(response);
  }

  async saveSportsField(
    accessToken: string,
    organizationId: string,
    input: SportsFieldInput,
  ) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/${organizationId}/venues/${input.venueId}/fields`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: input.fieldName,
          format: input.format,
          status: input.status,
          scheduleMode: input.scheduleMode,
          scheduleOverride: input.scheduleOverride,
          hourlyPrice: input.hourlyPrice,
          currency: input.currency,
        }),
      },
    );

    return this.readDraftResponse(response);
  }

  async deleteSportsField(
    accessToken: string,
    organizationId: string,
    fieldId: string,
  ) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/${organizationId}/fields/${fieldId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return this.readDraftResponse(response);
  }

  async deleteVenue(accessToken: string, organizationId: string, venueId: string) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/${organizationId}/venues/${venueId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return this.readDraftResponse(response);
  }

  async saveFieldAvailability(
    accessToken: string,
    organizationId: string,
    fieldId: string,
    input: FieldAvailabilityInput,
  ) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/${organizationId}/fields/${fieldId}/availability`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

    return this.readDraftResponse(response);
  }

  async updateVenueStatus(
    accessToken: string,
    organizationId: string,
    venueId: string,
    status: "active" | "inactive",
  ) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/${organizationId}/venues/${venueId}/status`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );
    return this.readDraftResponse(response);
  }

  async updateFieldStatus(
    accessToken: string,
    organizationId: string,
    fieldId: string,
    status: "active" | "inactive",
  ) {
    const response = await fetch(
      `${this.baseUrl}/venue-organizations/${organizationId}/fields/${fieldId}/status`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );
    return this.readDraftResponse(response);
  }

  private async readDraftResponse(response: Response) {
    if (!response.ok) {
      const error = (await response
        .json()
        .catch(() => ({}))) as ApiErrorResponse;
      throw new Error(error.message ?? "No pudimos guardar el club.");
    }

    const draft = (await response.json()) as BusinessOnboardingDraft;
    const venues = (draft.venues ?? (draft.location ? [draft.location] : [])).map(
      (venue) => ({
        ...venue,
        coordinates: venue.coordinates ?? null,
        status: venue.status ?? "active",
        defaultSchedule: venue.defaultSchedule ?? null,
      }),
    );
    const fields = (draft.fields ?? (draft.field ? [draft.field] : [])).map(
      (field) => ({
        ...field,
        status: field.status ?? "active",
        scheduleMode: field.scheduleMode ?? "inherit",
        scheduleOverride: field.scheduleOverride ?? null,
        hourlyPrice: field.hourlyPrice ?? field.availability?.hourlyPrice ?? 0,
        currency: field.currency ?? field.availability?.currency ?? "PEN",
      }),
    );

    return {
      ...draft,
      venues,
      fields,
      location:
        venues.find((venue) => venue.venueId === draft.location?.venueId) ??
        venues[0] ??
        null,
      field: draft.field ?? fields[0] ?? null,
    };
  }
}
