import { HttpVenueOnboardingGateway } from "./HttpVenueOnboardingGateway";
import { MockVenueOnboardingGateway } from "./MockVenueOnboardingGateway";
import type { VenueOnboardingGateway } from "@/src/features/venues/types/businessOnboarding";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

if (!apiUrl && !__DEV__) {
  throw new Error("EXPO_PUBLIC_API_URL es obligatorio fuera de desarrollo.");
}

export const venueOnboardingGateway: VenueOnboardingGateway = apiUrl
  ? new HttpVenueOnboardingGateway(apiUrl)
  : new MockVenueOnboardingGateway();
