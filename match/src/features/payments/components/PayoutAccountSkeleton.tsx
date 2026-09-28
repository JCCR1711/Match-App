import AppSkeleton from "@/src/components/ui/AppSkeleton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const PayoutAccountSkeleton = () => (
  <View accessibilityRole="progressbar" accessibilityLabel="Cargando cuenta de depósito" style={styles.container}>
    <AppSkeleton height={208} radius={theme.radius.card} />
    <AppSkeleton height={24} width="54%" radius={theme.radius.small} />
    <AppSkeleton height={64} radius={theme.radius.large} />
    <AppSkeleton height={64} radius={theme.radius.large} />
    <AppSkeleton height={64} radius={theme.radius.large} />
  </View>
);

export default memo(PayoutAccountSkeleton);

const styles = StyleSheet.create({
  container: { gap: theme.spacing.md },
});
