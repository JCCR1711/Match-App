import CustomText from "@/src/components/ui/CustomText";
import type { ReservationSourceSummary as SourceItem } from "@/src/features/analytics/types/businessAnalytics";
import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const ReservationSourceSummary = ({ items }: { items: SourceItem[] }) => {
  const total = items.reduce((sum, item) => sum + item.reservations, 0);
  return (
    <LinearGradient
      colors={[theme.colors.businessBlueSurface, theme.colors.authBlueDeep, theme.colors.cobalt]}
      locations={[0, 0.58, 1]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
      accessible
      accessibilityLabel={items.map((item) => `${item.label}: ${item.reservations} reservas`).join(". ")}
    >
      {items.map((item) => {
        const share = total ? Math.round((item.reservations / total) * 100) : 0;
        return (
          <View key={item.source} style={styles.source}>
            <CustomText text={`${share}%`} variant="heading" style={styles.share} />
            <CustomText text={item.label} variant="bodyStrong" style={styles.name} />
          </View>
        );
      })}
    </LinearGradient>
  );
};

export default ReservationSourceSummary;

const styles = StyleSheet.create({
  card: { minHeight: 136, flexDirection: "row", alignItems: "stretch", gap: theme.spacing.md, padding: theme.spacing.xl, borderRadius: theme.radius.card, borderCurve: "continuous", overflow: "hidden" },
  source: { minWidth: 0, flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing.sm },
  name: { color: theme.colors.white },
  share: { flexShrink: 0, color: theme.colors.white },
});
