import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import TimePickerSheet from "@/src/features/venues/components/TimePickerSheet";
import WeekdaySelector from "@/src/features/venues/components/WeekdaySelector";
import type { WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { ArrowRight01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
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
      <CustomText text="Horario" variant="body" style={styles.sectionTitle} />
      <View style={styles.times}>
        <TimeRow label="Apertura" value={value.openingTime} onPress={() => setPicker("opening")} disabled={disabled} accent={theme.colors.accentSoft} backgroundColor="rgba(115, 254, 101, 0.10)" />
        <TimeRow label="Cierre" value={value.closingTime} onPress={() => setPicker("closing")} disabled={disabled} accent={theme.colors.iceBlue} backgroundColor="rgba(103, 199, 255, 0.11)" />
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

const TimeRow = ({ label, value, onPress, disabled, accent, backgroundColor }: { label: string; value: string; onPress: () => void; disabled: boolean; accent: string; backgroundColor: string }) => (
  <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.timeRow, { backgroundColor }, disabled && styles.disabled, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`${label}: ${value}`}>
    <View style={styles.timeHeading}>
      <CustomIcon icon={Clock01Icon} color={accent} size={24} strokeWidth={2.2} />
      <CustomText text={label} variant="caption" style={[styles.timeLabel, { color: accent }]} />
    </View>
    <View style={styles.timeValue}>
      <CustomText text={value} variant="body" style={styles.selectedTime} />
      <CustomIcon icon={ArrowRight01Icon} color={accent} size={24} strokeWidth={2.2} />
    </View>
  </Pressable>
);

export default WeeklyScheduleEditor;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.md },
  block: { gap: theme.spacing.md, marginBottom: theme.spacing.sm },
  sectionTitle: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold },
  times: { flexDirection: "row", gap: theme.spacing.md },
  timeRow: { flex: 1, minHeight: 126, justifyContent: "space-between", padding: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderCurve: "continuous" },
  timeHeading: { gap: theme.spacing.sm },
  timeLabel: { fontFamily: theme.fontFamilies.poppinsBold },
  timeValue: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.xs },
  selectedTime: { color: theme.colors.white, fontSize: 22, lineHeight: 28, fontFamily: theme.fontFamilies.poppinsBold },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.72 },
});
