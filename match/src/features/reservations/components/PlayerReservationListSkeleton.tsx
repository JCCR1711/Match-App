import AppSkeleton from "@/src/components/ui/AppSkeleton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const PlayerReservationListSkeleton = () => (
  <View accessibilityRole="progressbar" accessibilityLabel="Cargando reservas" style={styles.container}>
    <AppSkeleton height={24} width="42%" radius={theme.radius.small} />
    <AppSkeleton height={138} radius={theme.radius.extraLarge} />
    <AppSkeleton height={138} radius={theme.radius.extraLarge} />
    <AppSkeleton height={138} radius={theme.radius.extraLarge} />
  </View>
);

export default memo(PlayerReservationListSkeleton);

const styles = StyleSheet.create({
  container: { gap: theme.spacing.md },
});
