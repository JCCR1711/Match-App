import CustomText from "@/src/components/ui/CustomText";
import type { NearbyAvailableVenue, PlayerCoordinates, PlayerLocationSource } from "@/src/features/home/types/nearbyVenue";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface NearbyVenuesMapProps {
  venues: NearbyAvailableVenue[];
  playerCoordinates: PlayerCoordinates;
  locationSource: PlayerLocationSource;
  onSelectVenue: (venueId: string) => void;
}

const NearbyVenuesMap = ({ venues }: NearbyVenuesMapProps) => (
  <View style={styles.container}>
    <CustomText text={`${venues.length} canchas disponibles cerca`} variant="sectionHeading" style={styles.title} />
    <CustomText text="El mapa interactivo está disponible en iOS y Android." variant="caption" style={styles.metadata} />
  </View>
);

export default NearbyVenuesMap;

const styles = StyleSheet.create({
  container: { minHeight: 160, justifyContent: "flex-end", gap: theme.spacing.xs, padding: theme.spacing.lg, borderRadius: theme.radius.card, backgroundColor: theme.colors.authSurface },
  title: { color: theme.colors.white },
  metadata: { color: theme.colors.authTextSecondary },
});
