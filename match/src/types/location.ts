export interface DeviceCoordinates {
  latitude: number;
  longitude: number;
}

export type DeviceLocationPermission = "checking" | "undetermined" | "granted" | "denied";
