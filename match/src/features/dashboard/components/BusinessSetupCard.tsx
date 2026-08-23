import AppSurface from "@/src/components/ui/AppSurface";
import BusinessCardArrow from "@/src/features/dashboard/components/BusinessCardArrow";
import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Image, type ImageSource } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export type BusinessSetupKind = "venue" | "field" | "availability";

interface BusinessSetupCardProps {
  kind: BusinessSetupKind;
  title: string;
  accessibilityLabel: string;
  onPress: () => void;
}

const setupVisuals: Record<BusinessSetupKind, { image: ImageSource; colors: readonly [string, string] }> = {
  venue: {
    image: require("@/src/assets/venues/characters/venue-player-teal-v2.png") as ImageSource,
    colors: ["#07373B", "#0FA9B5"],
  },
  field: {
    image: require("@/src/assets/venues/characters/venue-player-coral-v2.png") as ImageSource,
    colors: ["#4A1E18", "#F05A35"],
  },
  availability: {
    image: require("@/src/assets/venues/characters/venue-player-cobalt-v2.png") as ImageSource,
    colors: ["#17143F", "#4D3DDB"],
  },
};

const BusinessSetupCard = ({ kind, title, accessibilityLabel, onPress }: BusinessSetupCardProps) => {
  const visual = setupVisuals[kind];

  return (
    <AppSurface onPress={onPress} accessibilityLabel={accessibilityLabel} style={styles.card}>
      <LinearGradient colors={[visual.colors[0], visual.colors[1]]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <Image source={visual.image} contentFit="cover" contentPosition="center" transition={180} accessible={false} style={styles.heroImage} />
      <LinearGradient colors={["transparent", "rgba(8, 8, 10, 0.84)"]} locations={[0.34, 1]} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <View style={styles.content}>
        <View style={styles.footer}>
          <Text style={styles.title}>{title}</Text>
          <BusinessCardArrow backgroundColor={theme.colors.white} color={theme.colors.black} style={styles.action} />
        </View>
      </View>
    </AppSurface>
  );
};

export default BusinessSetupCard;

const styles = StyleSheet.create({
  card: { minHeight: 232 },
  content: { flex: 1, minHeight: 232, justifyContent: "flex-end", padding: theme.spacing.xxl },
  heroImage: { ...StyleSheet.absoluteFillObject },
  footer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: theme.spacing.xl },
  title: { flex: 1, maxWidth: 170, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 24, lineHeight: 30, fontWeight: theme.fontWeights.bold },
  action: { zIndex: 2, width: 44, height: 44 },
});
