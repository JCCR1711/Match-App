import AppSkeleton from "@/src/components/ui/AppSkeleton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const BusinessDashboardSkeleton = () => (
  <View accessibilityRole="progressbar" accessibilityLabel="Preparando tu inicio" style={styles.container}>
    <AppSkeleton height={168} radius={theme.radius.card} />
    <AppSkeleton height={24} width="48%" radius={theme.radius.small} />
    <View style={styles.row}>
      <AppSkeleton height={124} width="auto" radius={theme.radius.extraLarge} style={styles.item} />
      <AppSkeleton height={124} width="auto" radius={theme.radius.extraLarge} style={styles.item} />
    </View>
    <AppSkeleton height={184} radius={theme.radius.card} />
  </View>
);

export default memo(BusinessDashboardSkeleton);

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  row: { flexDirection: "row", gap: theme.spacing.md },
  item: { flex: 1 },
});
