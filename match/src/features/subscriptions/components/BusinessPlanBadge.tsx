import CustomText from "@/src/components/ui/CustomText";
import type { BusinessPlan } from "@/src/features/subscriptions/types/businessSubscription";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const BusinessPlanBadge = ({ plan }: { plan: BusinessPlan }) => (
  <View style={[styles.badge, plan === "pro" && styles.proBadge]}>
    <CustomText text={plan === "pro" ? "Pro" : "Basic"} variant="label" style={[styles.label, plan === "pro" && styles.proLabel]} />
  </View>
);

export default memo(BusinessPlanBadge);

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", minHeight: 30, justifyContent: "center", paddingHorizontal: theme.spacing.md, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceOnDarkSubtle },
  proBadge: { backgroundColor: theme.colors.white },
  label: { color: theme.colors.authTextSecondary },
  proLabel: { color: theme.colors.black },
});
