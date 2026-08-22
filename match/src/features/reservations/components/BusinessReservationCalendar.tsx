import CustomText from "@/src/components/ui/CustomText";
import ReservationMonthSheet from "@/src/features/reservations/components/ReservationMonthSheet";
import { addDays, formatMonthYear, toDateKey } from "@/src/features/reservations/utils/reservationDate";
import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

interface BusinessReservationCalendarProps {
  selectedDateKey: string;
  activityCounts: ReadonlyMap<string, number>;
  onSelectDate: (dateKey: string) => void;
}

const weekdayFormatter = new Intl.DateTimeFormat("es-PE", { weekday: "short" });
const monthFormatter = new Intl.DateTimeFormat("es-PE", { month: "short" });

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const BusinessReservationCalendar = ({ selectedDateKey, activityCounts, onSelectDate }: BusinessReservationCalendarProps) => {
  const [monthVisible, setMonthVisible] = useState(false);
  const scrollX = useSharedValue(0);
  const viewportWidth = useSharedValue(0);
  const contentWidth = useSharedValue(0);
  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const weekDates = useMemo(() => {
    const weekStart = addDays(selectedDate, -selectedDate.getDay());
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }, [selectedDate]);
  const onWeekScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  const leftFadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, 18], [0, 1], Extrapolation.CLAMP),
  }));
  const rightFadeStyle = useAnimatedStyle(() => {
    const remaining = Math.max(0, contentWidth.value - viewportWidth.value - scrollX.value);
    return { opacity: interpolate(remaining, [0, 18], [0, 1], Extrapolation.CLAMP) };
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <CustomText text={formatMonthYear(selectedDate)} variant="subtitle" style={styles.title} />
          <Pressable onPress={() => setMonthVisible(true)} accessibilityRole="button" accessibilityLabel="Abrir calendario mensual" style={({ pressed }) => [styles.monthAction, pressed && styles.pressed]}>
            <CustomText text="Calendario" variant="actionSecondary" style={styles.monthActionText} />
          </Pressable>
        </View>
        <View style={styles.weekFrame} onLayout={(event) => { viewportWidth.value = event.nativeEvent.layout.width; }}>
        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.week} accessibilityRole="tablist" onContentSizeChange={(width) => { contentWidth.value = width; }} onScroll={onWeekScroll} scrollEventThrottle={16}>
          {weekDates.map((date) => {
            const dateKey = toDateKey(date);
            const selected = dateKey === selectedDateKey;
            const count = activityCounts.get(dateKey) ?? 0;
            const weekday = weekdayFormatter.format(date).replace(".", "").slice(0, 2);
            const month = monthFormatter.format(date).replace(".", "");
            return (
              <Pressable key={dateKey} accessibilityRole="tab" accessibilityState={{ selected }} accessibilityLabel={`${weekday} ${date.getDate()}, ${count} reservas`} onPress={() => onSelectDate(dateKey)} style={({ pressed }) => [styles.day, selected && styles.daySelected, pressed && styles.pressed]}>
                <CustomText text={weekday} variant="label" style={[styles.weekday, selected && styles.dayTextSelected]} />
                <CustomText text={String(date.getDate())} variant="action" style={[styles.dayNumber, selected && styles.dayTextSelected]} />
                <CustomText text={month} variant="label" style={[styles.month, selected && styles.dayTextSelected]} />
                <View style={[styles.countBadge, count > 0 && styles.countBadgeActive, selected && styles.countBadgeSelected]}>
                  <CustomText text={count > 0 ? String(count) : "·"} variant="label" style={[styles.count, count > 0 && styles.countActive, selected && styles.countSelected]} />
                </View>
              </Pressable>
            );
          })}
        </Animated.ScrollView>
        <Animated.View pointerEvents="none" style={[styles.edgeFade, styles.leftFade, leftFadeStyle]}>
          <LinearGradient colors={[theme.colors.businessBlueSurface, "rgba(23, 27, 102, 0)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.edgeFade, styles.rightFade, rightFadeStyle]}>
          <LinearGradient colors={["rgba(23, 27, 102, 0)", theme.colors.businessBlueSurface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
        </View>
      </View>
      <ReservationMonthSheet visible={monthVisible} selectedDateKey={selectedDateKey} activityCounts={activityCounts} onSelectDate={onSelectDate} onClose={() => setMonthVisible(false)} />
    </>
  );
};

export default BusinessReservationCalendar;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg, padding: theme.spacing.lg, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.businessBlueSurface },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  title: { flex: 1, minWidth: 0, color: theme.colors.white, fontSize: 25, lineHeight: 32 },
  monthAction: { minHeight: 48, justifyContent: "center", paddingHorizontal: theme.spacing.sm },
  monthActionText: { color: theme.colors.authTextSecondary },
  weekFrame: { position: "relative", overflow: "hidden", marginHorizontal: -theme.spacing.lg },
  week: { gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
  edgeFade: { position: "absolute", top: 0, bottom: 0, width: 34 },
  leftFade: { left: 0 },
  rightFade: { right: 0 },
  day: { width: 66, minHeight: 118, alignItems: "center", justifyContent: "center", gap: theme.spacing.xxs, borderRadius: 100 },
  daySelected: { backgroundColor: theme.colors.accent },
  weekday: { color: theme.colors.authTextSecondary, textTransform: "uppercase" },
  dayNumber: { color: theme.colors.white },
  month: { color: theme.colors.authTextSecondary, textTransform: "uppercase" },
  countBadge: { minWidth: 22, height: 20, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill },
  countBadgeActive: { backgroundColor: theme.colors.businessBlueSurface },
  countBadgeSelected: { backgroundColor: theme.colors.black },
  count: { color: theme.colors.authTextSecondary },
  countActive: { color: theme.colors.white },
  countSelected: { color: theme.colors.white },
  dayTextSelected: { color: theme.colors.black },
  pressed: { opacity: 0.7 },
});
