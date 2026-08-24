import DeviceLocationContext from "@/src/context/DeviceLocationContext";
import type { DeviceCoordinates, DeviceLocationPermission } from "@/src/types/location";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

interface DeviceLocationProviderProps {
  children: ReactNode;
}

const toCoordinates = (position: Location.LocationObject): DeviceCoordinates => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
});

const DeviceLocationProvider = ({ children }: DeviceLocationProviderProps) => {
  const [coordinates, setCoordinates] = useState<DeviceCoordinates | null>(null);
  const [permission, setPermission] = useState<DeviceLocationPermission>("checking");
  const [isLoading, setIsLoading] = useState(true);
  const activeRequest = useRef<Promise<DeviceCoordinates | null> | null>(null);

  const readPosition = useCallback(async (allowCached: boolean) => {
    const cached = allowCached
      ? await Location.getLastKnownPositionAsync({ maxAge: 600_000, requiredAccuracy: 750 })
      : null;
    const position = cached ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const nextCoordinates = toCoordinates(position);
    setCoordinates(nextCoordinates);
    return nextCoordinates;
  }, []);

  const runRequest = useCallback((requestPermission: boolean, allowCached: boolean) => {
    if (activeRequest.current) return activeRequest.current;

    const request = (async () => {
      setIsLoading(true);
      try {
        let permissionResult = await Location.getForegroundPermissionsAsync();
        if (requestPermission && !permissionResult.granted && permissionResult.canAskAgain) {
          permissionResult = await Location.requestForegroundPermissionsAsync();
        }
        setPermission(permissionResult.granted ? "granted" : permissionResult.canAskAgain ? "undetermined" : "denied");
        if (!permissionResult.granted) return null;
        return await readPosition(allowCached);
      } catch {
        return null;
      } finally {
        setIsLoading(false);
        activeRequest.current = null;
      }
    })();

    activeRequest.current = request;
    return request;
  }, [readPosition]);

  useEffect(() => {
    let active = true;
    void Location.getForegroundPermissionsAsync().then(async (permissionResult) => {
      if (!active) return;
      const nextPermission = permissionResult.granted ? "granted" : permissionResult.canAskAgain ? "undetermined" : "denied";
      setPermission(nextPermission);
      if (permissionResult.granted) await runRequest(false, true);
      else setIsLoading(false);
    }).catch(() => {
      if (active) {
        setPermission("undetermined");
        setIsLoading(false);
      }
    });
    return () => { active = false; };
  }, [runRequest]);

  const requestCurrentLocation = useCallback(() => runRequest(true, true), [runRequest]);
  const refreshLocation = useCallback(() => runRequest(false, false), [runRequest]);

  const value = useMemo(() => ({
    coordinates,
    permission,
    isLoading,
    requestCurrentLocation,
    refreshLocation,
  }), [coordinates, isLoading, permission, refreshLocation, requestCurrentLocation]);

  return <DeviceLocationContext.Provider value={value}>{children}</DeviceLocationContext.Provider>;
};

export default DeviceLocationProvider;
