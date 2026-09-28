import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export interface AppChoiceOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface AppChoiceGroupProps<T extends string> {
  options: readonly AppChoiceOption<T>[];
  value: T;
  tone?: "accent" | "neutral";
  layout?: "row" | "flow";
  disabled?: boolean;
  onChange: (value: T) => void;
}

const AppChoiceGroupComponent = <T extends string>({
  options,
  value,
  tone = "neutral",
  layout = "row",
  disabled,
  onChange,
}: AppChoiceGroupProps<T>) => (
  <View style={[styles.group, layout === "flow" && styles.flow]} accessibilityRole="radiogroup">
    {options.map((option) => {
      const selected = option.value === value;
      const optionDisabled = disabled || option.disabled;

      return (
        <Pressable
          key={option.value}
          disabled={optionDisabled}
          onPress={() => onChange(option.value)}
          accessibilityRole="radio"
          accessibilityState={{ selected, disabled: optionDisabled }}
          style={({ pressed }) => [
            styles.option,
            layout === "flow" && styles.flowOption,
            selected && tone === "accent" && styles.selectedAccent,
            selected && tone === "neutral" && styles.selectedNeutral,
            optionDisabled && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <CustomText
            text={option.label}
            variant={layout === "flow" ? "label" : "bodyStrong"}
            style={[styles.label, selected && styles.selectedLabel]}
            numberOfLines={1}
          />
        </Pressable>
      );
    })}
  </View>
);

const AppChoiceGroup = memo(AppChoiceGroupComponent) as typeof AppChoiceGroupComponent;

export default AppChoiceGroup;

const styles = StyleSheet.create({
  group: { flexDirection: "row", gap: theme.spacing.sm },
  flow: { flexWrap: "wrap" },
  option: {
    flex: 1,
    minHeight: theme.spacing.huge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
  },
  flowOption: {
    flex: 0,
    minHeight: 48,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceOnDarkSubtle,
  },
  selectedAccent: { backgroundColor: theme.colors.accent },
  selectedNeutral: { backgroundColor: theme.colors.authPrimary },
  label: { color: theme.colors.authTextSecondary },
  selectedLabel: { color: theme.colors.black },
  disabled: { opacity: 0.38 },
  pressed: { opacity: 0.8 },
});
