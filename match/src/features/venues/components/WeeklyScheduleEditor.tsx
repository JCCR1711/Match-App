import AppSurface from "@/src/components/ui/AppSurface";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import TimePickerSheet from "@/src/features/venues/components/TimePickerSheet";
import WeekdaySelector from "@/src/features/venues/components/WeekdaySelector";
import type { WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface WeeklyScheduleEditorProps {
  value: WeeklySchedule;
  onChange: (value: WeeklySchedule) => void;
  disabled?: boolean;
}

type Picker = "opening" | "closing" | null;

const WeeklyScheduleEditor = ({ value, onChange, disabled = false }: WeeklyScheduleEditorProps) => {
  const [picker, setPicker] = useState<Picker>(null);
  const updateTime = (time: string) => {
    onChange({
      ...value,
      openingTime: picker === "opening" ? time : value.openingTime,
      closingTime: picker === "closing" ? time : value.closingTime,
    });
    setPicker(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <CustomText text="Días activos" variant="body" style={styles.sectionTitle} />
        <WeekdaySelector value={value.weekdays} disabled={disabled} onChange={(weekdays) => onChange({ ...value, weekdays })} />
      </View>
      <View style={styles.block}>
        <CustomText text="Horario" variant="body" style={styles.sectionTitle} />
        <AppSurface style={styles.timeGroup}>
          <TimeRow label="Apertura" value={value.openingTime} onPress={() => setPicker("opening")} disabled={disabled} />
          <View style={styles.divider} />
          <TimeRow label="Cierre" value={value.closingTime} onPress={() => setPicker("closing")} disabled={disabled} />
        </AppSurface>
      </View>
      <TimePickerSheet
        visible={picker !== null}
        title={picker === "opening" ? "Hora de apertura" : "Hora de cierre"}
        value={picker === "opening" ? value.openingTime : value.closingTime}
        onSelect={updateTime}
        onClose={() => setPicker(null)}
      />
    </View>
  );
};

const TimeRow = ({ label, value, onPress, disabled }: { label: string; value: string; onPress: () => void; disabled: boolean }) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [styles.timeRow, disabled && styles.disabled, pressed && styles.pressed]}
    accessibilityRole="button"
    accessibilityLabel={`${label}: ${value}`}
  >
    <CustomText text={label} variant="caption" style={styles.timeLabel} />
    <View style={styles.timeValue}>
      <CustomText text={value} variant="body" style={styles.selectedTime} />
      <CustomIcon icon={ArrowRight01Icon} color={theme.colors.authTextSecondary} size={20} />
    </View>
  </Pressable>
);

export default WeeklyScheduleEditor;

const styles = StyleSheet.create({
  container: { gap: theme.layout.groupGap },
  block: { gap: theme.spacing.md },
  sectionTitle: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold },
  timeGroup: { overflow: "hidden" },
  timeRow: { minHeight: 68, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg },
  timeLabel: { color: theme.colors.authTextSecondary },
  timeValue: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  selectedTime: { color: theme.colors.white, fontSize: 18, lineHeight: 24, fontFamily: theme.fontFamilies.poppinsBold },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: theme.spacing.lg, backgroundColor: "rgba(255, 255, 255, 0.1)" },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.72 },
});
