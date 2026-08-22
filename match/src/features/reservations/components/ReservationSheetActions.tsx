import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

const ReservationSheetActions = ({ children }: { children: ReactNode }) => (
  <View style={styles.actions}>{children}</View>
);

export default ReservationSheetActions;

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
});
