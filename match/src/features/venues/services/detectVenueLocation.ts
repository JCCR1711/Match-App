import type { VenueCoordinates } from "@/src/features/venues/types/businessOnboarding";
import * as Location from "expo-location";

export interface DetectedVenueLocation {
  address: string;
  district: string;
  city: string;
  coordinates: VenueCoordinates;
}

const normalizePlaceName = (value: string | null | undefined) => value?.trim() ?? "";

const firstDistinctPlaceName = (candidates: (string | null | undefined)[], excluded: string[]) => {
  const normalizedExcluded = excluded.map((value) => value.trim().toLocaleLowerCase());
  return candidates
    .map(normalizePlaceName)
    .find((value) => value && !normalizedExcluded.includes(value.toLocaleLowerCase())) ?? "";
};

export const resolveVenueCoordinates = async (coordinates: VenueCoordinates): Promise<DetectedVenueLocation> => {
  const [place] = await Location.reverseGeocodeAsync(coordinates);
  if (!place) {
    throw new Error("Encontramos la posición, pero no pudimos obtener la dirección.");
  }

  const street = normalizePlaceName(place.street);
  const streetAddress = [street, normalizePlaceName(place.streetNumber)].filter(Boolean).join(" ");
  const address = streetAddress || normalizePlaceName(place.name) || normalizePlaceName(place.formattedAddress);
  const city = firstDistinctPlaceName([place.city, place.region, place.subregion], []);
  const district = firstDistinctPlaceName(
    [place.district, place.subregion, place.name],
    [city, street, address, normalizePlaceName(place.region)],
  );

  return { address, district, city, coordinates };
};

export const searchVenueLocation = async (query: string): Promise<DetectedVenueLocation> => {
  const [location] = await searchVenueLocations(query, 1);
  if (!location) {
    throw new Error("No encontramos esa dirección. Intenta añadir distrito y ciudad.");
  }
  return location;
};

export const searchVenueLocations = async (query: string, limit = 4): Promise<DetectedVenueLocation[]> => {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Activa el permiso de ubicación para buscar una dirección.");
  }

  const results = await Location.geocodeAsync(query.trim());
  const locations = await Promise.all(results.slice(0, limit).map(async (result) => {
    const coordinates = { latitude: result.latitude, longitude: result.longitude };
    const location = await resolveVenueCoordinates(coordinates);
    return { ...location, address: location.address || query.trim() };
  }));

  return locations.filter((location, index, items) => {
    const key = `${location.address}|${location.district}|${location.city}`.toLocaleLowerCase();
    return items.findIndex((item) => `${item.address}|${item.district}|${item.city}`.toLocaleLowerCase() === key) === index;
  });
};

export const detectVenueLocation = async (): Promise<DetectedVenueLocation> => {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Activa el permiso de ubicación o completa la dirección manualmente.");
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  const coordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  return resolveVenueCoordinates(coordinates);
};
