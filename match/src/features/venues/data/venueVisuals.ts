import { theme } from "@/src/theme";
import type { ImageSource } from "expo-image";

export interface VenueVisual {
  image: ImageSource;
  colors: readonly [string, string];
  accentColors: readonly [string, string];
}

const venueBackdropColors = [theme.colors.surface, theme.colors.surfaceMuted] as const;

const venueVisuals: readonly VenueVisual[] = [
  {
    image: require("@/src/assets/venues/characters/venue-player-blue.png") as ImageSource,
    colors: venueBackdropColors,
    accentColors: [theme.colors.authBlueDeep, theme.colors.electricBlue],
  },
  {
    image: require("@/src/assets/venues/characters/venue-player-orange.png") as ImageSource,
    colors: venueBackdropColors,
    accentColors: [theme.colors.businessAmberSurface, theme.colors.sunsetOrange],
  },
  {
    image: require("@/src/assets/venues/characters/venue-player-lime.png") as ImageSource,
    colors: venueBackdropColors,
    accentColors: [theme.colors.businessTealSurface, theme.colors.accent],
  },
  {
    image: require("@/src/assets/venues/characters/venue-player-white-red.png") as ImageSource,
    colors: venueBackdropColors,
    accentColors: [theme.colors.stadiumRedDeep, theme.colors.softCoral],
  },
];

/** Assigns collision-free visuals for the current venue collection, independent of display order. */
export const getVenueVisual = (venueId: string, venueIds: readonly string[]) => {
  const stableVenueIds = [...venueIds].sort((firstId, secondId) => firstId.localeCompare(secondId));
  const stableIndex = Math.max(0, stableVenueIds.indexOf(venueId));
  return venueVisuals[stableIndex % venueVisuals.length];
};
