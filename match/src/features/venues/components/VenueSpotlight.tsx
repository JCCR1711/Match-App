import CustomText from "@/src/components/ui/CustomText";
import type { VenueVisual } from "@/src/features/venues/data/venueVisuals";
import type { ResourceStatus } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface VenueSpotlightProps {
  visual: VenueVisual;
  height: number;
  name: string;
  activeFieldCount: number;
  status: ResourceStatus;
}

const VenueSpotlight = ({ visual, height, name, activeFieldCount, status }: VenueSpotlightProps) => {
  return (
    <View style={[styles.container, { minHeight: height }]}>
      <Image
        source={visual.image}
        contentFit="contain"
        contentPosition="bottom right"
        transition={220}
        accessible={false}
        style={styles.player}
      />
      <View style={[styles.main, { minHeight: height }]}>
        <View style={styles.copy}>
          <CustomText text={status === "active" ? "SEDE ACTIVA" : "SEDE INACTIVA"} variant="label" style={[styles.status, status === "inactive" && styles.inactiveStatus]} />
          <CustomText text={name} variant="screenTitle" style={styles.name} numberOfLines={2} />
          <View style={styles.countRow}>
            <CustomText text={String(activeFieldCount)} variant="heading" style={styles.countValue} />
            <CustomText text={activeFieldCount === 1 ? "CANCHA ACTIVA" : "CANCHAS ACTIVAS"} variant="label" style={styles.countLabel} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(VenueSpotlight);

const styles = StyleSheet.create({
  container: { minHeight: 376, justifyContent: "flex-end", overflow: "hidden" },
  player: { position: "absolute", right: -2, bottom: theme.spacing.lg, width: 232, height: 368 },
  main: {
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  copy: { maxWidth: 168, alignItems: "flex-start", gap: theme.spacing.sm },
  status: { color: theme.colors.white, letterSpacing: 0.9 },
  inactiveStatus: { color: theme.colors.warning },
  name: { color: theme.colors.white, fontSize: 32, lineHeight: 38 },
  countRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  countValue: { color: theme.colors.white, fontSize: 30, lineHeight: 40, includeFontPadding: true },
  countLabel: { color: theme.colors.white, letterSpacing: 0.7 },
});
