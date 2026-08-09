import { HttpVenueOnboardingGateway } from "./HttpVenueOnboardingGateway";
import { MockVenueOnboardingGateway } from "./MockVenueOnboardingGateway";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

if (!apiUrl && !__DEV__) {
  throw new Error("EXPO_PUBLIC_API_URL es obligatorio fuera de desarrollo.");
}

export const venueOnboardingGateway = apiUrl
  ? new HttpVenueOnboardingGateway(apiUrl)
  : new MockVenueOnboardingGateway();
