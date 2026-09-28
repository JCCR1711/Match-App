import CustomText from "@/src/components/ui/CustomText";
import type { ReservationSource } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const ReservationSourceBadge = ({ source, emphasis = "compact" }: { source: ReservationSource; emphasis?: "compact" | "prominent" }) => (
  <View style={[
    styles.badge,
    source === "match" ? styles.match : styles.local,
    emphasis === "prominent" && styles.prominent,
    emphasis === "prominent" && source === "manual" && styles.prominentLocal,
  ]}>
    <CustomText
      text={source === "match" ? "MATCH" : "LOCAL"}
      variant={emphasis === "prominent" ? "bodyStrong" : "label"}
      style={[styles.label, emphasis === "prominent" && styles.prominentLabel, emphasis === "prominent" && source === "manual" && styles.prominentLocalLabel]}
    />
  </View>
);

export default memo(ReservationSourceBadge);

const styles = StyleSheet.create({
  badge: { paddingHorizontal: theme.spacing.xs, paddingVertical: 2, borderRadius: theme.radius.pill },
  match: { backgroundColor: theme.colors.authBlue },
  local: { backgroundColor: theme.colors.black },
  label: { color: theme.colors.white, fontSize: 10, lineHeight: 12, letterSpacing: 0.65 },
  prominent: { minHeight: 40, justifyContent: "center", paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  prominentLocal: { backgroundColor: theme.colors.authPrimary },
  prominentLabel: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 15, lineHeight: 20, letterSpacing: 0.8 },
  prominentLocalLabel: { color: theme.colors.black },
});
