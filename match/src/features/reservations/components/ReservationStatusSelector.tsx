import CustomText from "@/src/components/ui/CustomText";
import type { ReservationCreateStatus } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const options: readonly { value: ReservationCreateStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
];

interface ReservationStatusSelectorProps {
  value: ReservationCreateStatus;
  onChange: (value: ReservationCreateStatus) => void;
}

const ReservationStatusSelector = ({ value, onChange }: ReservationStatusSelectorProps) => (
  <View style={styles.section}>
    <CustomText text="Estado" variant="body" style={styles.title} />
    <View style={styles.options} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={`Reserva ${option.label.toLocaleLowerCase()}`}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.option,
              selected && (option.value === "pending" ? styles.pendingSelected : styles.confirmedSelected),
              pressed && styles.pressed,
            ]}
          >
            <CustomText
              text={option.label}
              variant="bodyStrong"
              style={[
                styles.label,
                selected && (option.value === "pending" ? styles.pendingLabel : styles.confirmedLabel),
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  </View>
);

export default memo(ReservationStatusSelector);

const styles = StyleSheet.create({
  section: { gap: theme.spacing.sm },
  title: { color: theme.colors.white },
  options: { flexDirection: "row", gap: theme.spacing.sm },
  option: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
  },
  pendingSelected: { backgroundColor: theme.colors.pendingSurface },
  confirmedSelected: { backgroundColor: theme.colors.confirmedSurface },
  label: { color: theme.colors.textOnDarkSecondary, textTransform: "uppercase", letterSpacing: 0.8 },
  pendingLabel: { color: theme.colors.pendingLimeText },
  confirmedLabel: { color: theme.colors.accent },
  pressed: { opacity: 0.74 },
});
