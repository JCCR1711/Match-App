import AppSkeleton from "@/src/components/ui/AppSkeleton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const BusinessAnalyticsSkeleton = () => (
  <View
    accessibilityRole="progressbar"
    accessibilityLabel="Cargando estadísticas"
    style={styles.container}
  >
    <AppSkeleton height={228} radius={theme.radius.card} />

    <View style={styles.section}>
      <AppSkeleton height={24} width="34%" radius={theme.radius.small} />
      <View style={styles.metrics}>
        {Array.from({ length: 4 }, (_, index) => (
          <AppSkeleton
            key={index}
            height={104}
            width="auto"
            radius={theme.radius.extraLarge}
            style={styles.metric}
          />
        ))}
      </View>
    </View>

    <View style={styles.section}>
      <AppSkeleton height={24} width="48%" radius={theme.radius.small} />
      <AppSkeleton height={156} radius={theme.radius.card} />
    </View>

    <View style={styles.section}>
      <AppSkeleton height={24} width="52%" radius={theme.radius.small} />
      <AppSkeleton height={168} radius={theme.radius.card} />
    </View>
  </View>
);

export default memo(BusinessAnalyticsSkeleton);

const styles = StyleSheet.create({
  container: { gap: theme.layout.sectionGap },
  section: { gap: theme.spacing.lg },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  metric: { flexBasis: "46%", flexGrow: 1 },
});
