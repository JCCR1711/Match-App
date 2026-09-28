import AppSkeleton from "@/src/components/ui/AppSkeleton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const BusinessAgendaSkeleton = () => (
  <View
    accessibilityRole="progressbar"
    accessibilityLabel="Cargando agenda"
    style={styles.container}
  >
    <AppSkeleton height={64} radius={theme.radius.extraLarge} />
    <View style={styles.calendar}>
      <View style={styles.heading}>
        <AppSkeleton height={24} width="42%" radius={theme.radius.small} />
        <AppSkeleton height={18} width={58} radius={theme.radius.small} />
      </View>
      <View style={styles.days}>
        {Array.from({ length: 4 }, (_, index) => (
          <AppSkeleton
            key={index}
            height={104}
            width="auto"
            radius={theme.radius.extraLarge}
            style={styles.day}
          />
        ))}
      </View>
    </View>
    <View style={styles.summary}>
      <AppSkeleton height={24} width="40%" radius={theme.radius.small} />
      <AppSkeleton height={42} width={124} radius={theme.radius.standard} />
    </View>
    <View style={styles.timeline}>
      <AppSkeleton height={28} width="34%" radius={theme.radius.small} />
      <AppSkeleton height={88} radius={theme.radius.extraLarge} />
      <AppSkeleton height={88} radius={theme.radius.extraLarge} />
      <AppSkeleton height={88} radius={theme.radius.extraLarge} />
    </View>
  </View>
);

export default memo(BusinessAgendaSkeleton);

const styles = StyleSheet.create({
  container: { gap: theme.layout.sectionGap },
  calendar: { gap: theme.spacing.lg },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  days: { flexDirection: "row", gap: theme.spacing.md },
  day: { flex: 1 },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },
  timeline: { gap: theme.spacing.md },
});
