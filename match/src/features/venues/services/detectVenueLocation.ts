import * as Location from "expo-location";
import type { VenueCoordinates } from "@/src/features/venues/types/businessOnboarding";

export interface DetectedVenueLocation {
  address: string;
  district: string;
  city: string;
  coordinates: VenueCoordinates;
}

export const detectVenueLocation = async (): Promise<DetectedVenueLocation> => {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Activa el permiso de ubicación o completa la dirección manualmente.");
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const coordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  const [place] = await Location.reverseGeocodeAsync(coordinates);
  if (!place) {
    throw new Error("Encontramos tu posición, pero no pudimos obtener la dirección.");
  }

  const address = [place.street, place.streetNumber].filter(Boolean).join(" ");
  const district = place.district ?? place.subregion ?? "";
  const city = place.city ?? place.region ?? "";

  return { address, district, city, coordinates };
};
