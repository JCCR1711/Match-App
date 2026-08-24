import type { DeviceCoordinates } from "@/src/types/location";

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number) => degrees * (Math.PI / 180);

export const calculateDistanceKm = (origin: DeviceCoordinates, destination: DeviceCoordinates) => {
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};
