import { findNearbyAvailableVenues } from "@/src/features/home/services/MockNearbyVenuesService";
import type { PlayerCoordinates, PlayerLocationSource } from "@/src/features/home/types/nearbyVenue";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { isSlotUnavailable } from "@/src/features/reservations/utils/isSlotUnavailable";
import { publicVenuesPreview } from "@/src/features/venues/data/publicVenuesPreview";
import useDeviceLocation from "@/src/hooks/useDeviceLocation";
import { useEffect, useMemo } from "react";

const mockPlayerCoordinates: PlayerCoordinates = { latitude: -12.105, longitude: -77.04 };

export const useNearbyAvailableVenues = () => {
  const { reservations, blocks, isHydrated } = useReservations();
  const { coordinates, isLoading: isLocating, requestCurrentLocation } = useDeviceLocation();
  const playerCoordinates: PlayerCoordinates = coordinates ?? mockPlayerCoordinates;
  const locationSource: PlayerLocationSource = coordinates ? "device" : "fallback";

  useEffect(() => {
    void requestCurrentLocation();
  }, [requestCurrentLocation]);

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
