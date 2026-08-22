import CustomText from "@/src/components/ui/CustomText";
import type { OccupancyComparison } from "@/src/features/analytics/types/businessAnalytics";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const OccupancyList = ({ items }: { items: OccupancyComparison[] }) => {
  if (items.length === 0) {
    return <CustomText text="No hay canchas con actividad en este periodo" variant="body" style={styles.emptyText} />;
  }

  return (
    <View style={styles.list}>
    {items.map((item, index) => (
      <View key={item.id} style={[styles.row, index < items.length - 1 && styles.rowSeparator]}>
        <View style={styles.copy}>
          <CustomText text={item.label} variant="body" style={styles.title} numberOfLines={1} />
          <CustomText text={item.venue} variant="caption" style={styles.subtitle} numberOfLines={1} />
        </View>
        <CustomText
          text={`${item.percentage}%`}
          variant="heading"
          style={styles.percentage}
          accessibilityLabel={`Ocupación de ${item.label}: ${item.percentage}%`}
        />
      </View>
    ))}
    </View>
  );
};

export default OccupancyList;

const styles = StyleSheet.create({
  list: { gap: 0 },
  row: { minHeight: 104, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: theme.spacing.lg, gap: theme.spacing.lg },
  rowSeparator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.dividerOnDark },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  title: { color: theme.colors.white },
  subtitle: { color: theme.colors.authTextSecondary },
  percentage: { flexShrink: 0, color: theme.colors.white, fontSize: 30, lineHeight: 36 },
  emptyText: { color: theme.colors.authTextSecondary, paddingVertical: theme.spacing.xl },
});
