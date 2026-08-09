import BusinessReservationsView from "@/src/features/reservations/views/BusinessReservationsView";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function BusinessReservationsRoute() {
  const { user } = useAuth();
  return user?.activeMode === "venue_manager" ? (
    <BusinessReservationsView />
  ) : (
    <Redirect href="/(tabs)" />
  );
}
