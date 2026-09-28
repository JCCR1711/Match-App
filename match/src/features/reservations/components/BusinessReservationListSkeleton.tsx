import AppSkeleton from "@/src/components/ui/AppSkeleton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const BusinessReservationListSkeleton = () => (
  <View
    accessibilityRole="progressbar"
    accessibilityLabel="Cargando reservas pendientes"
    style={styles.container}
  >
    <AppSkeleton height={20} width="46%" radius={theme.radius.small} />
    <AppSkeleton height={96} radius={theme.radius.card} />
    <AppSkeleton height={96} radius={theme.radius.card} />
    <AppSkeleton height={96} radius={theme.radius.card} />
  </View>
);

export default memo(BusinessReservationListSkeleton);

const styles = StyleSheet.create({
  container: { gap: theme.spacing.sm },
});
