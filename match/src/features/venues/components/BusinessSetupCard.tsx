import AppSurface from "@/src/components/ui/AppSurface";
import AppCardArrow from "@/src/components/ui/AppCardArrow";
import type { VenueVisual } from "@/src/features/venues/data/venueVisuals";
import { theme } from "@/src/theme";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export type BusinessSetupKind = "venue" | "field" | "availability";

interface BusinessSetupCardProps {
  kind: BusinessSetupKind;
  title: string;
  accessibilityLabel: string;
  onPress: () => void;
  presentation?: "illustrated" | "neutral" | "accent";
  venueVisual?: VenueVisual;
}

const setupVisuals: Record<BusinessSetupKind, { image?: ImageSource; colors: readonly [string, string] }> = {
  venue: {
    image: require("@/src/assets/venues/characters/venue-player-blue.png") as ImageSource,
    colors: [theme.colors.authBlueDeep, theme.colors.cobalt],
  },
  field: {
    image: require("@/src/assets/venues/characters/venue-player-orange.png") as ImageSource,
    colors: [theme.colors.businessAmberSurface, theme.colors.sunsetOrange],
  },
  availability: {
    image: require("@/src/assets/venues/characters/venue-player-blue.png") as ImageSource,
    colors: [theme.colors.deepTeal, theme.colors.authBlueDeep],
  },
};

const BusinessSetupCard = ({ kind, title, accessibilityLabel, onPress, presentation = "illustrated", venueVisual }: BusinessSetupCardProps) => {
  const visual = venueVisual ? { image: venueVisual.image, colors: venueVisual.accentColors } : setupVisuals[kind];
  const isNeutral = presentation === "neutral";
  const isAccent = presentation === "accent";

  return (
    <AppSurface onPress={onPress} accessibilityLabel={accessibilityLabel} style={[styles.card, (isNeutral || isAccent) && styles.compactCard]}>
      {isNeutral ? <View style={styles.neutralBackground} /> : <LinearGradient colors={[visual.colors[0], visual.colors[1]]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
      {!isNeutral && !isAccent ? (
        <LinearGradient
          colors={["transparent", theme.colors.mediaScrimMid, theme.colors.mediaScrimStrong]}
          locations={[0.24, 0.64, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      {!isNeutral && !isAccent && visual.image ? <Image source={visual.image} contentFit="contain" contentPosition="bottom right" transition={180} accessible={false} style={styles.heroImage} /> : null}
      <View style={[styles.content, (isNeutral || isAccent) && styles.compactContent]}>
        <View style={[styles.footer, (isNeutral || isAccent) && styles.neutralFooter]}>
          <Text style={[styles.title, isNeutral && styles.neutralTitle]}>{title}</Text>
          <AppCardArrow backgroundColor={isNeutral ? theme.colors.black : theme.colors.white} color={isNeutral ? theme.colors.white : theme.colors.black} style={styles.action} />
        </View>
      </View>
    </AppSurface>
  );
};

export default BusinessSetupCard;

const styles = StyleSheet.create({
  card: { minHeight: 286 },
  compactCard: { minHeight: 140 },
  neutralBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.authPrimary },
  content: { flex: 1, minHeight: 286, justifyContent: "flex-end", padding: theme.spacing.xxl },
  compactContent: { minHeight: 140, justifyContent: "center", padding: theme.spacing.xl },
  heroImage: { position: "absolute", top: theme.spacing.sm, right: theme.spacing.sm, bottom: 0, width: "60%" },
  footer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: theme.spacing.xl },
  neutralFooter: { alignItems: "center" },
  title: { flex: 1, maxWidth: 170, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 24, lineHeight: 30, fontWeight: theme.fontWeights.bold },
  neutralTitle: { color: theme.colors.black, fontSize: 18, lineHeight: 24 },
  action: { zIndex: 2, width: 44, height: 44 },
});
