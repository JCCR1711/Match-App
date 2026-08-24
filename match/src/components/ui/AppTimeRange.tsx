import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

export type AppTimeRangeTone = "neutral" | "available" | "reserved" | "pending" | "blocked" | "maintenance";

interface AppTimeRangeProps {
  startTime: string;
  endTime: string;
  tone?: AppTimeRangeTone;
}

const toneColors: Record<AppTimeRangeTone, string> = {
  neutral: theme.colors.white,
  available: theme.colors.accent,
  reserved: theme.colors.accent,
  pending: theme.colors.pendingLimeText,
  blocked: theme.colors.error,
  maintenance: theme.colors.warmAmber,
};

const AppTimeRange = ({ startTime, endTime, tone = "neutral" }: AppTimeRangeProps) => (
  <View style={styles.range} accessible accessibilityLabel={`Horario de ${startTime} a ${endTime}`}>
    <View style={styles.timeNode}>
      <CustomText text="Inicio" variant="caption" style={styles.label} />
      <CustomText text={startTime} variant="sectionHeading" style={styles.time} numberOfLines={1} />
    </View>
    <View style={styles.connector}>
      <View style={styles.connectorLine} />
      <View style={[styles.connectorMarker, { backgroundColor: toneColors[tone] }]} />
    </View>
    <View style={styles.timeNode}>
      <CustomText text="Fin" variant="caption" style={styles.label} />
      <CustomText text={endTime} variant="sectionHeading" style={[styles.time, { color: toneColors[tone] }]} numberOfLines={1} />
    </View>
  </View>
);

export default memo(AppTimeRange);

const styles = StyleSheet.create({
  range: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: theme.spacing.xs },
  timeNode: { flex: 1, minHeight: 78, alignItems: "center", justifyContent: "center", gap: theme.spacing.xxs, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface },
  connector: { flex: 0.3, height: 12, alignItems: "center", justifyContent: "center" },
  connectorLine: { position: "absolute", width: "100%", height: 2, backgroundColor: theme.colors.dividerOnDark },
  connectorMarker: { width: 8, height: 8, borderRadius: theme.radius.pill },
  label: { color: theme.colors.textOnDarkSecondary },
  time: { color: theme.colors.white, textAlign: "center" },
});
