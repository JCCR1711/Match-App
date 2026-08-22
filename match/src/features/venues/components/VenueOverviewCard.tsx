import AppSurface from "@/src/components/ui/AppSurface";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { ArrowUpRight01Icon, Location01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface VenueOverviewCardProps {
  name: string;
  location: string;
  fieldCount: number;
  onPress: () => void;
  onOpenMenu: () => void;
}

/** A spacious venue surface: each venue is a primary, navigable entity. */
const VenueOverviewCard = ({ name, location, fieldCount, onPress, onOpenMenu }: VenueOverviewCardProps) => (
  <AppSurface style={styles.card}>
    <Pressable onPress={onPress} style={({ pressed }) => [styles.main, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Abrir ${name}`}>
      <View style={styles.copy}>
        <CustomText text={name} variant="sectionHeading" style={styles.name} numberOfLines={1} />
        <View style={styles.metaRow}>
          <CustomIcon icon={Location01Icon} color={theme.colors.authTextSecondary} size={17} strokeWidth={2.2} />
          <CustomText text={location} variant="caption" style={styles.meta} numberOfLines={1} />
        </View>
      </View>
      <View style={styles.footer}>
        <CustomText text={`${fieldCount} ${fieldCount === 1 ? "cancha" : "canchas"}`} variant="body" style={styles.fieldCount} />
        <CustomIcon icon={ArrowUpRight01Icon} color={theme.colors.authTextSecondary} size={20} strokeWidth={2.3} />
      </View>
    </Pressable>
    <CustomButton icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.authTextSecondary} size={24} />} size="icon" variant="inverse" onPress={onOpenMenu} style={styles.menu} accessibilityLabel={`Opciones de ${name}`} />
  </AppSurface>
);

export default VenueOverviewCard;

const styles = StyleSheet.create({
  card: { minHeight: 132, overflow: "hidden" },
  main: { flex: 1, justifyContent: "space-between", gap: theme.spacing.lg, padding: theme.spacing.xl },
  copy: { gap: theme.spacing.xs, paddingRight: theme.spacing.xxl },
  name: { color: theme.colors.white },
  metaRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  meta: { flex: 1, color: theme.colors.authTextSecondary },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  fieldCount: { color: theme.colors.white },
  pressed: { opacity: 0.76 },
  menu: { position: "absolute", top: theme.spacing.sm, right: theme.spacing.sm, width: 48, height: 48, minHeight: 48, borderWidth: 0, backgroundColor: "transparent" },
});
