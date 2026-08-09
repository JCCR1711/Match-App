import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { ArrowRight01Icon, Location01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

interface VenueOverviewCardProps {
  name: string;
  location: string;
  fieldCount: number;
  onPress: () => void;
  onOpenMenu: () => void;
}

const VenueOverviewCard = ({ name, location, fieldCount, onPress, onOpenMenu }: VenueOverviewCardProps) => (
  <View style={styles.container}>
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject} accessible={false}>
      <Defs>
        <LinearGradient id="venue-card-surface" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#292A2D" />
          <Stop offset="55%" stopColor={theme.colors.surface} />
          <Stop offset="100%" stopColor={theme.colors.backgroundAlt} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" rx="28" fill="url(#venue-card-surface)" />
    </Svg>
    <Pressable onPress={onPress} style={({ pressed }) => [styles.main, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Abrir ${name}`}>
      <View style={styles.copy}>
        <CustomText text={name} variant="body" style={styles.name} numberOfLines={2} />
        <View style={styles.location}>
          <CustomIcon icon={Location01Icon} color={theme.colors.authTextSecondary} size={18} strokeWidth={2.2} />
          <CustomText text={location} variant="caption" style={styles.meta} numberOfLines={1} />
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.metric}>
          <CustomText text={String(fieldCount)} variant="body" style={styles.countValue} />
          <CustomText text={fieldCount === 1 ? "Cancha" : "Canchas"} variant="caption" style={styles.countLabel} />
        </View>
        <View style={styles.arrow}>
          <CustomIcon icon={ArrowRight01Icon} color={theme.colors.white} size={28} strokeWidth={2.9} />
        </View>
      </View>
    </Pressable>
    <CustomButton icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.white} size={26} />} size="icon" variant="inverse" onPress={onOpenMenu} style={styles.menu} accessibilityLabel={`Opciones de ${name}`} />
  </View>
);

export default VenueOverviewCard;

const styles = StyleSheet.create({
  container: { minHeight: 176, overflow: "hidden", borderRadius: 26, borderCurve: "continuous", backgroundColor: theme.colors.surface },
  main: { flex: 1, gap: theme.spacing.md, padding: theme.spacing.lg },
  copy: { gap: theme.spacing.xs },
  location: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  name: { maxWidth: "82%", color: theme.colors.white, fontSize: 20, lineHeight: 25, fontFamily: theme.fontFamilies.poppinsBold },
  meta: { color: theme.colors.authTextSecondary },
  footer: { marginTop: "auto", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: theme.spacing.xl },
  metric: { gap: 0 },
  countValue: { color: theme.colors.white, fontSize: 34, lineHeight: 38, fontFamily: theme.fontFamilies.poppinsBold },
  countLabel: { color: theme.colors.authTextSecondary },
  arrow: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: "rgba(255, 255, 255, 0.1)" },
  pressed: { opacity: 0.82 },
  menu: { position: "absolute", top: theme.spacing.md, right: theme.spacing.md, width: 44, height: 44, minHeight: 44, borderWidth: 0, backgroundColor: "transparent" },
});
