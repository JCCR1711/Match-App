import CustomText from "@/src/components/ui/CustomText";
import ReservationSheetFrame from "@/src/features/reservations/components/ReservationSheetFrame";
import { addDays, formatMonthYear, toDateKey } from "@/src/features/reservations/utils/reservationDate";
import { theme } from "@/src/theme";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

interface ReservationMonthSheetProps {
  visible: boolean;
  selectedDateKey: string;
  activityCounts: ReadonlyMap<string, number>;
  onSelectDate: (dateKey: string) => void;
  onClose: () => void;
}

const weekdays = ["D", "L", "M", "M", "J", "V", "S"] as const;

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const ReservationMonthSheet = ({ visible, selectedDateKey, activityCounts, onSelectDate, onClose }: ReservationMonthSheetProps) => {
  const selectedDate = parseDateKey(selectedDateKey);
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const cellCount = Math.ceil((monthEnd.getDate() + monthStart.getDay()) / 7) * 7;
  const dates = Array.from({ length: cellCount }, (_, index) => addDays(gridStart, index));

  return (
    <ReservationSheetFrame visible={visible} title={formatMonthYear(selectedDate)} collapsedHeight={580} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.weekdays}>
          {weekdays.map((weekday, index) => <CustomText key={`${weekday}-${index}`} text={weekday} variant="label" style={styles.weekday} />)}
        </View>
        <View style={styles.grid}>
          {dates.map((date) => {
            const dateKey = toDateKey(date);
            const selected = dateKey === selectedDateKey;
            const inMonth = date.getMonth() === selectedDate.getMonth();
            const count = activityCounts.get(dateKey) ?? 0;
            return (
              <Pressable key={dateKey} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`Seleccionar ${date.getDate()}, ${count} reservas`} onPress={() => { onSelectDate(dateKey); onClose(); }} style={({ pressed }) => [styles.day, selected && styles.daySelected, pressed && styles.pressed]}>
                <CustomText text={String(date.getDate())} variant="body" style={[styles.dayText, !inMonth && styles.dayTextMuted, selected && styles.dayTextSelected]} />
                {count > 0 ? <CustomText text={String(count)} variant="label" style={[styles.count, selected && styles.countSelected]} /> : <View style={styles.countPlaceholder} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ReservationSheetFrame>
  );
};

export default ReservationMonthSheet;

const styles = StyleSheet.create({
  content: { paddingBottom: theme.spacing.xl },
  weekdays: { flexDirection: "row", marginBottom: theme.spacing.md },
  weekday: { width: `${100 / 7}%`, color: theme.colors.authTextSecondary, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: theme.spacing.xs },
  day: { width: `${100 / 7}%`, minHeight: 64, alignItems: "center", justifyContent: "center", gap: theme.spacing.xxs, borderRadius: 100 },
  daySelected: { backgroundColor: theme.colors.accent },
  dayText: { color: theme.colors.white },
  dayTextMuted: { color: theme.colors.surfaceMuted },
  dayTextSelected: { color: theme.colors.black },
  count: { minWidth: 18, color: theme.colors.accent, textAlign: "center" },
  countSelected: { color: theme.colors.black },
  countPlaceholder: { height: 16 },
  pressed: { opacity: 0.7 },
});
