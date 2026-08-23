import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

export interface ReservationSheetDetail {
  label: string;
  value: string;
}

interface ReservationSheetDetailsProps {
  items: ReservationSheetDetail[];
  align?: "start" | "center";
  divided?: boolean;
}

const ReservationSheetDetails = ({ items, align = "start", divided = true }: ReservationSheetDetailsProps) => (
  <View style={[styles.grid, !divided && styles.continuation, align === "center" && styles.centeredGrid]}>
    {items.map((item, index) => (
      <View key={item.label} style={[styles.item, index % 2 === 1 && styles.trailingItem, align === "center" && styles.centeredItem]}>
        <CustomText text={item.label} variant="caption" style={styles.label} />
        <CustomText text={item.value} variant="bodyStrong" style={[styles.value, index % 2 === 1 && styles.trailingText, align === "center" && styles.centeredText]} numberOfLines={2} />
      </View>
    ))}
  </View>
);

export default memo(ReservationSheetDetails);

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: theme.spacing.xl,
    rowGap: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.dividerOnDark,
  },
  item: { minWidth: 0, flexGrow: 1, flexBasis: "42%", justifyContent: "center", gap: theme.spacing.xs },
  trailingItem: { alignItems: "flex-end" },
  trailingText: { textAlign: "right" },
  label: { color: theme.colors.authTextSecondary },
  value: { color: theme.colors.white },
  centeredGrid: { justifyContent: "center" },
  centeredItem: { flexGrow: 0, flexBasis: "auto", alignItems: "center" },
  centeredText: { textAlign: "center" },
  continuation: { paddingTop: 0, borderTopWidth: 0 },
});
