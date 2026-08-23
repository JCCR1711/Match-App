import { theme } from "@/src/theme";
import type { ImageSource } from "expo-image";

export interface VenueVisual {
  image: ImageSource;
  colors: readonly [string, string];
}

const venueVisuals: readonly VenueVisual[] = [
  {
    image: require("@/src/assets/venues/characters/venue-player-blue.png") as ImageSource,
    colors: [theme.colors.authBlueDeep, theme.colors.cobalt],
  },
  {
    image: require("@/src/assets/venues/characters/venue-player-violet.png") as ImageSource,
    colors: [theme.colors.businessOrchidSurface, theme.colors.electricViolet],
  },
  {
    image: require("@/src/assets/venues/characters/venue-player-orange.png") as ImageSource,
    colors: [theme.colors.businessAmberSurface, theme.colors.sunsetOrange],
  },
];

export const getVenueVisual = (index: number) => venueVisuals[Math.max(0, index) % venueVisuals.length];
