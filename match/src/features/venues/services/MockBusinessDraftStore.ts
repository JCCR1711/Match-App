import type {
  BusinessOnboardingDraft,
  FieldAvailability,
  SportsFieldDraft,
} from "@/src/features/venues/types/businessOnboarding";
import * as SecureStore from "expo-secure-store";

const getDraftKey = (ownerId: string) => `match.mock-business.draft.${ownerId}`;

type LegacySportsFieldDraft = Omit<
  SportsFieldDraft,
  "availability" | "venueId"
> & {
  venueId?: string;
  availability?: FieldAvailability | null;
};

type LegacyBusinessDraft = Omit<BusinessOnboardingDraft, "field" | "fields" | "venues"> & {
  field: LegacySportsFieldDraft | null;
  fields?: LegacySportsFieldDraft[];
  venues?: BusinessOnboardingDraft["venues"];
  availability?: FieldAvailability | null;
};

export class MockBusinessDraftStore {
  async get(ownerId: string) {
    if (!(await SecureStore.isAvailableAsync())) return null;
    const serializedDraft = await SecureStore.getItemAsync(
      getDraftKey(ownerId),
    );
    if (!serializedDraft) return null;

    try {
      const parsedDraft = JSON.parse(serializedDraft) as LegacyBusinessDraft;
      const { availability: legacyAvailability, ...currentDraft } = parsedDraft;
      const venues = (
        parsedDraft.venues ?? (currentDraft.location ? [currentDraft.location] : [])
      ).map((venue) => ({
        ...venue,
        coordinates: venue.coordinates ?? null,
        status: venue.status ?? "active",
        defaultSchedule: venue.defaultSchedule ?? null,
      }));
      const legacyFields = parsedDraft.fields ?? (parsedDraft.field ? [parsedDraft.field] : []);
      const fields = legacyFields.map((field) => ({
        ...field,
        venueId: field.venueId ?? currentDraft.location?.venueId ?? "",
        availability: field.availability ?? legacyAvailability ?? null,
        status: field.status ?? "active",
        scheduleMode: field.scheduleMode ?? "inherit",
        scheduleOverride: field.scheduleOverride ?? null,
        hourlyPrice: field.hourlyPrice ?? field.availability?.hourlyPrice ?? legacyAvailability?.hourlyPrice ?? 0,
        currency: field.currency ?? field.availability?.currency ?? legacyAvailability?.currency ?? "PEN",
      }));

      return {
        ...currentDraft,
        venues,
        fields,
        location:
          venues.find(
            (venue) => venue.venueId === currentDraft.location?.venueId,
          ) ?? venues[0] ?? null,
        field: fields[0] ?? null,
      } satisfies BusinessOnboardingDraft;
    } catch {
      await SecureStore.deleteItemAsync(getDraftKey(ownerId));
      return null;
    }
  }

  async save(ownerId: string, draft: BusinessOnboardingDraft) {
    if (!(await SecureStore.isAvailableAsync())) return;
    await SecureStore.setItemAsync(
      getDraftKey(ownerId),
      JSON.stringify(draft),
      { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY },
    );
  }
}
