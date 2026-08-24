import CustomText from "@/src/components/ui/CustomText";
import type { Weekday } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { Pressable, StyleSheet, View } from "react-native";

const WEEKDAYS: { value: Weekday; shortLabel: string; label: string }[] = [
  { value: "monday", shortLabel: "L", label: "Lunes" },
  { value: "tuesday", shortLabel: "M", label: "Martes" },
  { value: "wednesday", shortLabel: "M", label: "Miércoles" },
  { value: "thursday", shortLabel: "J", label: "Jueves" },
  { value: "friday", shortLabel: "V", label: "Viernes" },
  { value: "saturday", shortLabel: "S", label: "Sábado" },
  { value: "sunday", shortLabel: "D", label: "Domingo" },
];

interface WeekdaySelectorProps {
  value: Weekday[];
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (weekdays: Weekday[]) => void;
}

const WeekdaySelector = ({ value, disabled, readOnly = false, onChange }: WeekdaySelectorProps) => {
  const toggle = (weekday: Weekday) => {
    onChange?.(
      value.includes(weekday)
        ? value.filter((item) => item !== weekday)
        : [...value, weekday],
    );
  };

  return (
    <View style={styles.container}>
      {WEEKDAYS.map((weekday) => {
        const selected = value.includes(weekday.value);
        const content = (
          <CustomText
            text={weekday.shortLabel}
            variant="body"
            style={[styles.label, selected && styles.labelSelected]}
          />
        );
        if (readOnly) {
          return (
            <View
              key={weekday.value}
              accessible
              accessibilityLabel={`${weekday.label}: ${selected ? "disponible" : "no disponible"}`}
              style={[styles.day, selected && styles.daySelected]}
            >
              {content}
            </View>
          );
        }
        return (
          <Pressable
            key={weekday.value}
            onPress={() => toggle(weekday.value)}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityLabel={weekday.label}
            accessibilityState={{ checked: selected, disabled }}
            style={({ pressed }) => [
              styles.day,
              selected && styles.daySelected,
              pressed && styles.pressed,
            ]}
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
};

export default WeekdaySelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.xxs,
  },
  day: {
    flex: 1,
    minWidth: 0,
    aspectRatio: 1,
    maxWidth: 44,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceOnDarkSubtle,
  },
  daySelected: {
    backgroundColor: theme.colors.authBlue,
  },
  label: {
    color: theme.colors.authTextSecondary,
  },
  labelSelected: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
  },
  pressed: {
    opacity: 0.76,
  },
});
