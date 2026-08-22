import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import type { OpenMatchPreview } from "@/src/features/home/types/openMatch";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import type { PublicVenue } from "@/src/features/venues/types/publicVenue";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

interface OpenMatchCardProps {
  match: OpenMatchPreview;
  venue: PublicVenue;
  width: number;
  onPress: () => void;
}

const OpenMatchCard = ({ match, venue, width, onPress }: OpenMatchCardProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Ver ${match.title}, ${match.dateLabel} a las ${match.time}, ${match.availableSpots} cupos`}
    onPress={onPress}
    style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
  >
    <Image source={getVenueImage(venue.id)} style={styles.cover} contentFit="cover" transition={220} accessibilityLabel={`Cancha de ${venue.name}`} />
    <View style={[styles.details, styles[match.tone]]}>
      <View style={styles.copy}>
        <CustomText text={match.title} variant="action" style={styles.title} numberOfLines={1} />
        <CustomText text={`${match.dateLabel}, ${match.time} · ${match.availableSpots} cupos`} variant="caption" style={styles.metadata} numberOfLines={1} />
      </View>
      <View style={styles.arrow}>
        <CustomIcon icon={ArrowRight01Icon} color={theme.colors.black} size={19} strokeWidth={2.5} />
      </View>
    </View>
  </Pressable>
);

export default OpenMatchCard;

const styles = StyleSheet.create({
  card: { overflow: "hidden", borderRadius: theme.radius.extraLarge },
  cover: { width: "100%", aspectRatio: 2.2, backgroundColor: theme.colors.authSurface },
  details: { minHeight: 84, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg },
  blue: { backgroundColor: theme.colors.cobalt },
  teal: { backgroundColor: theme.colors.deepTeal },
  orchid: { backgroundColor: theme.colors.deepOrchid },
  copy: { flex: 1, gap: theme.spacing.xxs },
  title: { color: theme.colors.white },
  metadata: { color: theme.colors.white, opacity: 0.78 },
  arrow: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.accent },
  pressed: { opacity: 0.76 },
});
