import { findNearbyAvailableVenues } from "@/src/features/home/services/MockNearbyVenuesService";
import type { PlayerCoordinates, PlayerLocationSource } from "@/src/features/home/types/nearbyVenue";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { isSlotUnavailable } from "@/src/features/reservations/utils/isSlotUnavailable";
import { publicVenuesPreview } from "@/src/features/venues/data/publicVenuesPreview";
import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";

const mockPlayerCoordinates: PlayerCoordinates = { latitude: -12.105, longitude: -77.04 };

export const useNearbyAvailableVenues = () => {
  const { reservations, blocks, isHydrated } = useReservations();
  const [playerCoordinates, setPlayerCoordinates] = useState<PlayerCoordinates>(mockPlayerCoordinates);
  const [locationSource, setLocationSource] = useState<PlayerLocationSource>("mock");
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    let active = true;

    const locatePlayer = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted") return;

        const position =
          (await Location.getLastKnownPositionAsync({ maxAge: 300_000, requiredAccuracy: 500 })) ??
          (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));

        if (!active) return;
        setPlayerCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationSource("device");
      } catch {
        // The Lima mock location keeps discovery usable when location is unavailable.
      } finally {
        if (active) setIsLocating(false);
      }
    };

    void locatePlayer();
    return () => {
      active = false;
    };
  }, []);

  const venues = useMemo(
    () =>
      findNearbyAvailableVenues({
        venues: publicVenuesPreview,
        playerCoordinates,
        isSlotUnavailable: (fieldId, slot) =>
          isSlotUnavailable({
            fieldId,
            dateKey: reservationDates[0].dateKey,
            startTime: slot,
            reservations,
            blocks,
          }),
      }),
    [blocks, playerCoordinates, reservations],
  );

  return { venues, playerCoordinates, locationSource, isLoading: isLocating || !isHydrated };
};
