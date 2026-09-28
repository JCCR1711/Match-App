import AppSkeleton from "@/src/components/ui/AppSkeleton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const BusinessVenuesSkeleton = () => (
  <View accessibilityRole="progressbar" accessibilityLabel="Cargando sedes" style={styles.container}>
    <View style={styles.selector}>
      <AppSkeleton height={48} width={132} radius={theme.radius.extraLarge} />
      <AppSkeleton height={48} width={132} radius={theme.radius.extraLarge} />
    </View>
    <View style={styles.identity}>
      <AppSkeleton height={112} width={112} radius={theme.radius.extraLarge} />
      <View style={styles.identityCopy}>
        <AppSkeleton height={18} width="32%" radius={theme.radius.small} />
        <AppSkeleton height={34} width="86%" radius={theme.radius.small} />
        <AppSkeleton height={18} width="62%" radius={theme.radius.small} />
      </View>
    </View>
    <AppSkeleton height={92} radius={theme.radius.large} />
    <AppSkeleton height={92} radius={theme.radius.large} />
  </View>
);

export default memo(BusinessVenuesSkeleton);

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  selector: { flexDirection: "row", gap: theme.spacing.sm },
  identity: { flexDirection: "row", alignItems: "flex-end", gap: theme.spacing.lg },
  identityCopy: { flex: 1, gap: theme.spacing.sm, paddingBottom: theme.spacing.xs },
});
