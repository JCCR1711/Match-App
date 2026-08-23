import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { getVenueVisual } from "@/src/features/venues/data/venueVisuals";
import type { ResourceStatus } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface VenueSpotlightProps {
  index: number;
  name: string;
  fieldCount: number;
  activeFieldCount: number;
  status: ResourceStatus;
  onOpenMenu: () => void;
}

const VenueSpotlight = ({ index, name, fieldCount, activeFieldCount, status, onOpenMenu }: VenueSpotlightProps) => {
  const visual = getVenueVisual(index);

  return (
    <View style={styles.container}>
      <CustomText text={String(index + 1).padStart(2, "0")} variant="display" style={styles.watermark} accessible={false} />
      <Image source={visual.image} contentFit="contain" contentPosition="bottom right" transition={220} accessible={false} style={styles.player} />
      <View style={styles.main}>
        <View style={styles.copy}>
          <CustomText text={status === "active" ? "SEDE ACTIVA" : "SEDE INACTIVA"} variant="label" style={[styles.status, status === "inactive" && styles.inactiveStatus]} />
          <CustomText text={name} variant="screenTitle" style={styles.name} numberOfLines={2} />
          <View style={styles.countRow}>
            <CustomText text={String(activeFieldCount)} variant="heading" style={styles.countValue} />
            <View style={styles.countCopy}>
              <CustomText text={activeFieldCount === 1 ? "CANCHA ACTIVA" : "CANCHAS ACTIVAS"} variant="label" style={styles.countLabel} />
              <CustomText text={`de ${fieldCount} ${fieldCount === 1 ? "cancha" : "canchas"}`} variant="caption" style={styles.countTotal} />
            </View>
          </View>
        </View>
      </View>
      <CustomButton
        icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.black} size={25} strokeWidth={3} />}
        size="icon"
        variant="light"
        onPress={onOpenMenu}
        style={styles.menu}
        accessibilityLabel={`Opciones de ${name}`}
      />
    </View>
  );
};

export default memo(VenueSpotlight);

const styles = StyleSheet.create({
  container: { minHeight: 376, marginHorizontal: -theme.spacing.lg, justifyContent: "flex-end", overflow: "hidden", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.dividerOnDark },
  watermark: { position: "absolute", top: theme.spacing.sm, left: theme.spacing.lg, color: theme.colors.surfaceOnDarkSubtle, fontSize: 112, lineHeight: 132, includeFontPadding: true },
  player: { position: "absolute", right: -2, bottom: 0, width: 232, height: 368 },
  main: { minHeight: 376, justifyContent: "flex-end", padding: theme.spacing.xl },
  copy: { maxWidth: 168, gap: theme.spacing.sm },
  status: { color: theme.colors.white, letterSpacing: 0.9 },
  inactiveStatus: { color: theme.colors.warning },
  name: { color: theme.colors.white, fontSize: 32, lineHeight: 38 },
  countRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  countValue: { color: theme.colors.white, fontSize: 30, lineHeight: 40, includeFontPadding: true },
  countCopy: { justifyContent: "center", gap: 0 },
  countLabel: { color: theme.colors.white, letterSpacing: 0.7 },
  countTotal: { color: theme.colors.textOnMediaSecondary },
  menu: { position: "absolute", top: theme.spacing.md, right: theme.spacing.md, width: 48, height: 48, minHeight: 48, borderWidth: 0, borderRadius: theme.radius.pill },
});
