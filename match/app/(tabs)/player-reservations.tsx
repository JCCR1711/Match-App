import PlayerReservationsView from "@/src/features/reservations/views/PlayerReservationsView";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function PlayerReservationsRoute() {
  const { user } = useAuth();

  if (user?.activeMode === "venue_manager") {
    return <Redirect href="/(tabs)/business-reservations" />;
  }

  return <PlayerReservationsView />;
}
