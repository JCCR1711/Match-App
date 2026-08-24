import VenueChoicePill from "@/src/features/venues/components/VenueChoicePill";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

export interface VenueChoiceOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface VenueChoiceGroupProps<T extends string> {
  options: readonly VenueChoiceOption<T>[];
  value: T;
  tone?: "accent" | "neutral";
  disabled?: boolean;
  onChange: (value: T) => void;
}

const VenueChoiceGroupComponent = <T extends string>({ options, value, tone = "neutral", disabled, onChange }: VenueChoiceGroupProps<T>) => (
  <View style={styles.container}>
    {options.map((option) => (
      <VenueChoicePill
        key={option.value}
        label={option.label}
        tone={tone}
        selected={option.value === value}
        disabled={disabled || option.disabled}
        onPress={() => onChange(option.value)}
      />
    ))}
  </View>
);

const VenueChoiceGroup = memo(VenueChoiceGroupComponent) as typeof VenueChoiceGroupComponent;

export default VenueChoiceGroup;

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: theme.spacing.sm },
});
