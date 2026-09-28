import AppCardArrow from "@/src/components/ui/AppCardArrow";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface BusinessMarketplaceLinkProps {
  visibleInMatch: boolean;
  onPress?: () => void;
}

const BusinessMarketplaceLink = ({ visibleInMatch, onPress }: BusinessMarketplaceLinkProps) => (
  <AppSurface
    variant="transparent"
    onPress={onPress}
    accessibilityLabel={onPress
      ? `${visibleInMatch ? "Visible en MATCH" : "Agenda local"}. Abrir reservas online`
      : visibleInMatch ? "El negocio está visible en MATCH" : "El negocio usa agenda local"}
    style={styles.row}
  >
    <View style={styles.copy}>
      <CustomText text="Reservas online" variant="sectionHeading" style={styles.title} />
      <CustomText text={visibleInMatch ? "Tu negocio está visible para jugadores" : "Agenda local · Activa reservas de jugadores"} variant="caption" style={styles.detail} numberOfLines={2} />
    </View>
    {onPress ? <AppCardArrow backgroundColor={theme.colors.white} color={theme.colors.black} style={styles.arrow} /> : null}
  </AppSurface>
);

export default memo(BusinessMarketplaceLink);

const styles = StyleSheet.create({
  row: { minHeight: 104, flexDirection: "row", alignItems: "center", gap: theme.spacing.lg, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.lg, backgroundColor: theme.colors.businessBlueSurface },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  title: { color: theme.colors.white },
  detail: { color: theme.colors.textOnDarkSecondary },
  arrow: { width: 48, height: 48 },
});
