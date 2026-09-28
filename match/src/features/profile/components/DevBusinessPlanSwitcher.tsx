import AppChoiceGroup from "@/src/components/ui/AppChoiceGroup";
import CustomText from "@/src/components/ui/CustomText";
import type { BusinessPlan } from "@/src/features/subscriptions/types/businessSubscription";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const options = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
] as const;

const DevBusinessPlanSwitcher = ({ value, disabled, onChange }: { value: BusinessPlan; disabled: boolean; onChange: (plan: BusinessPlan) => void }) => (
  <View style={styles.container}>
    <CustomText text="Plan de prueba" variant="body" style={styles.title} />
    <AppChoiceGroup options={options} value={value} disabled={disabled} onChange={onChange} />
  </View>
);

export default DevBusinessPlanSwitcher;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.md },
  title: { color: theme.colors.white, fontSize: 19, lineHeight: 26, fontFamily: theme.fontFamilies.poppinsBold },
});
