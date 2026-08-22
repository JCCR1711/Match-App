import type {
  BusinessOnboardingDraft,
  FieldAvailability,
  SportsFieldDraft,
} from "@/src/features/venues/types/businessOnboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    const key = getDraftKey(ownerId);
    let serializedDraft = await AsyncStorage.getItem(key);
    if (!serializedDraft && (await SecureStore.isAvailableAsync())) {
      serializedDraft = await SecureStore.getItemAsync(key);
      if (serializedDraft) {
        await AsyncStorage.setItem(key, serializedDraft);
        await SecureStore.deleteItemAsync(key);
      }
    }
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
        nightHourlyPrice: field.nightHourlyPrice ?? field.hourlyPrice ?? field.availability?.hourlyPrice ?? legacyAvailability?.hourlyPrice ?? 0,
        nightStartsAt: field.nightStartsAt ?? "18:00",
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
      await AsyncStorage.removeItem(key);
      if (await SecureStore.isAvailableAsync()) await SecureStore.deleteItemAsync(key);
      return null;
    }
  }

  async save(ownerId: string, draft: BusinessOnboardingDraft) {
    await AsyncStorage.setItem(getDraftKey(ownerId), JSON.stringify(draft));
  }
}
