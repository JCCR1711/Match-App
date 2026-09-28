import type {
  BusinessOnboardingDraft,
  FieldAvailability,
  SportsFieldDraft,
} from "@/src/features/venues/types/businessOnboarding";
import {
  businessDemoFields,
  businessDemoVenues,
} from "@/src/features/venues/data/businessDemoVenues";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const getDraftKey = (ownerId: string) => `match.mock-business.draft.${ownerId}`;
const getDraftVersionKey = (ownerId: string) =>
  `match.mock-business.draft-version.${ownerId}`;
const DEMO_BUSINESS_OWNER_ID = "mock-venue-owner-1";
export const BUSINESS_DEMO_VERSION = 1;

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
    if (ownerId === DEMO_BUSINESS_OWNER_ID) {
      const storedVersion = await AsyncStorage.getItem(getDraftVersionKey(ownerId));
      if (storedVersion !== String(BUSINESS_DEMO_VERSION)) {
        const demoDraft = createDemoBusinessDraft();
        await AsyncStorage.multiSet([
          [key, JSON.stringify(demoDraft)],
          [getDraftVersionKey(ownerId), String(BUSINESS_DEMO_VERSION)],
        ]);
        if (await SecureStore.isAvailableAsync()) {
          await SecureStore.deleteItemAsync(key);
        }
        return demoDraft;
      }
    }
    let serializedDraft = await AsyncStorage.getItem(key);
    if (!serializedDraft && (await SecureStore.isAvailableAsync())) {
      serializedDraft = await SecureStore.getItemAsync(key);
      if (serializedDraft) {
        await AsyncStorage.setItem(key, serializedDraft);
        await SecureStore.deleteItemAsync(key);
      }
    }
    if (!serializedDraft) {
      return ownerId === DEMO_BUSINESS_OWNER_ID ? createDemoBusinessDraft() : null;
    }

    try {
      const parsedDraft = JSON.parse(serializedDraft) as LegacyBusinessDraft;
      const { availability: legacyAvailability, ...currentDraft } = parsedDraft;
      const storedVenues = (
        parsedDraft.venues ?? (currentDraft.location ? [currentDraft.location] : [])
      ).map((venue) => ({
        ...venue,
        coordinates: venue.coordinates ?? null,
        status: venue.status ?? "active",
        defaultSchedule: venue.defaultSchedule ?? null,
      }));
      const venues = ownerId === DEMO_BUSINESS_OWNER_ID
        ? appendMissingDemoVenues(storedVenues)
        : storedVenues;
      const legacyFields = parsedDraft.fields ?? (parsedDraft.field ? [parsedDraft.field] : []);
      const storedFields = legacyFields.map((field) => ({
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
      const fields = ownerId === DEMO_BUSINESS_OWNER_ID
        ? appendMissingDemoFields(storedFields)
        : storedFields;

      return {
        ...currentDraft,
        marketplaceStatus: currentDraft.marketplaceStatus ?? (ownerId === DEMO_BUSINESS_OWNER_ID ? "live" : "local_only"),
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

const appendMissingDemoVenues = (
  venues: BusinessOnboardingDraft["venues"],
) => {
  if (venues.length >= businessDemoVenues.length) return venues;

  const existingIds = new Set(venues.map((venue) => venue.venueId));
  const missingVenues = businessDemoVenues.filter(
    (venue) => !existingIds.has(venue.venueId),
  );

  return [...venues, ...missingVenues.slice(0, businessDemoVenues.length - venues.length)];
};

const appendMissingDemoFields = (
  fields: BusinessOnboardingDraft["fields"],
) => {
  const demoIds = new Set(businessDemoFields.map((field) => field.fieldId));
  const fieldsById = new Map(fields.map((field) => [field.fieldId, field]));
  return [
    ...businessDemoFields.map((field) => fieldsById.get(field.fieldId) ?? field),
    ...fields.filter((field) => !demoIds.has(field.fieldId)),
  ];
};

const createDemoBusinessDraft = (): BusinessOnboardingDraft => ({
  organizationId: "mock-org-mock-venue-owner-1",
  marketplaceStatus: "live",
  membership: {
    organizationId: "mock-org-mock-venue-owner-1",
    role: "owner",
  },
  businessName: "Match Arena",
  contactPhone: "+51987654321",
  venues: [...businessDemoVenues],
  fields: [...businessDemoFields],
  location: businessDemoVenues[0],
  field: businessDemoFields[0],
  nextStep: "complete",
});
