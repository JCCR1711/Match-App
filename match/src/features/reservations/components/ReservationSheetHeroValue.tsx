import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface ReservationSheetHeroValueProps {
  value: string;
  prefix?: string;
  accessibilityLabel: string;
  align?: "start" | "center";
}

const ReservationSheetHeroValue = ({ value, prefix, accessibilityLabel, align = "start" }: ReservationSheetHeroValueProps) => (
  <View accessible accessibilityLabel={accessibilityLabel} style={[styles.surface, align === "center" && styles.centered]}>
    {prefix ? <CustomText text={prefix} variant="caption" style={styles.prefix} /> : null}
    <CustomText text={value} variant="display" style={styles.value} numberOfLines={1} />
  </View>
);

export default memo(ReservationSheetHeroValue);

const styles = StyleSheet.create({
  surface: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.xs,
  },
  prefix: { color: theme.colors.authTextSecondary },
  value: { color: theme.colors.white },
  centered: { alignSelf: "center" },
});
