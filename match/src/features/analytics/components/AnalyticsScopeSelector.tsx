import CustomText from "@/src/components/ui/CustomText";
import type { AnalyticsScope } from "@/src/features/analytics/types/businessAnalytics";
import { theme } from "@/src/theme";
import { Pressable, ScrollView, StyleSheet } from "react-native";

const options: { id: AnalyticsScope; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "miraflores", label: "Miraflores" },
  { id: "los-olivos", label: "Los Olivos" },
];

interface AnalyticsScopeSelectorProps {
  selectedScope: AnalyticsScope;
  onScopeChange: (scope: AnalyticsScope) => void;
}

const AnalyticsScopeSelector = ({ selectedScope, onScopeChange }: AnalyticsScopeSelectorProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content} accessibilityRole="tablist">
    {options.map((option) => {
      const selected = option.id === selectedScope;
      return (
        <Pressable
          key={option.id}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          accessibilityLabel={`Ver estadísticas de ${option.label}`}
          onPress={() => onScopeChange(option.id)}
          style={[styles.option, selected && styles.optionSelected]}
        >
          <CustomText text={option.label} variant="caption" style={[styles.label, selected && styles.labelSelected]} />
        </Pressable>
      );
    })}
  </ScrollView>
);

export default AnalyticsScopeSelector;

const styles = StyleSheet.create({
  content: { gap: theme.spacing.xs },
  option: { minHeight: 48, justifyContent: "center", paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface },
  optionSelected: { backgroundColor: theme.colors.white },
  label: { color: theme.colors.authTextSecondary },
  labelSelected: { color: theme.colors.black, fontFamily: theme.fontFamilies.poppinsBold },
});
