import type { DeviceCoordinates, DeviceLocationPermission } from "@/src/types/location";
import { createContext } from "react";

export interface DeviceLocationContextValue {
  coordinates: DeviceCoordinates | null;
  permission: DeviceLocationPermission;
  isLoading: boolean;
  requestCurrentLocation: () => Promise<DeviceCoordinates | null>;
  refreshLocation: () => Promise<DeviceCoordinates | null>;
}

const DeviceLocationContext = createContext<DeviceLocationContextValue | undefined>(undefined);

export default DeviceLocationContext;
