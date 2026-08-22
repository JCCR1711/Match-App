import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { BanknoteIcon, Clock01Icon, Money03Icon, PercentCircleIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

const metrics = [
  { id: "received", label: "Cobrado", value: "S/ 4,260", note: "+12%", icon: Money03Icon },
  { id: "fees", label: "Comisiones", value: "S/ 320", note: "7.5%", icon: PercentCircleIcon },
  { id: "pending", label: "Pendiente", value: "S/ 410", note: "3 pagos", icon: Clock01Icon },
  { id: "settled", label: "Liquidado", value: "S/ 2,260", note: "+6%", icon: BanknoteIcon },
];

const FinanceMetricGrid = () => (
  <View style={styles.list}>
    {metrics.map((metric, index) => (
      <View key={metric.id} style={[styles.row, index < metrics.length - 1 && styles.separator]}>
        <View style={styles.identity}>
          <View style={styles.icon}>
            <CustomIcon icon={metric.icon} color={theme.colors.white} size={21} strokeWidth={2.1} />
          </View>
          <CustomText text={metric.label} variant="body" style={styles.label} />
        </View>
        <View style={styles.amountGroup}>
          <CustomText text={metric.value} variant="body" style={styles.value} numberOfLines={1} />
          <CustomText text={metric.note} variant="caption" style={metric.note.startsWith("+") ? styles.positive : styles.note} />
        </View>
      </View>
    ))}
  </View>
);

export default FinanceMetricGrid;

const styles = StyleSheet.create({
  list: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.dividerOnDark },
  row: { minHeight: 82, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.lg, paddingVertical: theme.spacing.md },
  separator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.dividerOnDark },
  identity: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  icon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.businessBlueSurface },
  label: { color: theme.colors.white },
  amountGroup: { alignItems: "flex-end", gap: theme.spacing.xxs },
  value: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold },
  note: { color: theme.colors.authTextSecondary },
  positive: { color: theme.colors.accent },
});
