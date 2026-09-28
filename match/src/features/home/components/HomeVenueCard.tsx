import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import type { NearbyAvailableVenue } from "@/src/features/home/types/nearbyVenue";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import { theme } from "@/src/theme";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface HomeVenueCardProps { item: NearbyAvailableVenue; width: number; onPress: () => void }

const HomeVenueCard = ({ item, width, onPress }: HomeVenueCardProps) => (
  <AppSurface variant="transparent" accessibilityLabel={`Ver ${item.venue.name}`} onPress={onPress} style={[styles.card, { width }]}>
    <Image source={getVenueImage(item.venue.id)} style={styles.cover} contentFit="cover" transition={220} accessibilityLabel={`Cancha de ${item.venue.name}`} />
    <View style={styles.copy}>
      <CustomText text={item.venue.name} variant="actionSecondary" style={styles.title} numberOfLines={1} />
      <CustomText text={`${item.distanceLabel} · desde S/ ${item.startingPrice}`} variant="caption" style={styles.metadata} numberOfLines={1} />
    </View>
  </AppSurface>
);

export default HomeVenueCard;

const styles = StyleSheet.create({
  card: { minWidth: 0 },
  cover: { width: "100%", aspectRatio: 1.58, borderRadius: theme.radius.extraLarge },
  copy: { minHeight: 62, justifyContent: "center", gap: theme.spacing.xxs, paddingTop: theme.spacing.xs },
  title: { color: theme.colors.white },
  metadata: { color: theme.colors.authTextSecondary },
});
