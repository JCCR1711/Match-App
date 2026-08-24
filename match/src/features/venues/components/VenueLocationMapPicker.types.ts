import type { DetectedVenueLocation } from "@/src/features/venues/services/detectVenueLocation";
import type { VenueCoordinates } from "@/src/features/venues/types/businessOnboarding";

export interface VenueLocationMapPickerProps {
  coordinates: VenueCoordinates | null;
  address: string;
  district: string;
  city: string;
  disabled?: boolean;
  onSelect: (location: DetectedVenueLocation) => void;
}
