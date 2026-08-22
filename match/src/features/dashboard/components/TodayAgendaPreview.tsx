import AppSection from "@/src/components/ui/AppSection";
import CustomText from "@/src/components/ui/CustomText";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

type AgendaItem =
  | { id: string; time: string; title: string; detail: string; status: "confirmed" | "pending" }
  | { id: string; time: string; title: string; detail: string; status: "blocked" };

const TodayAgendaPreview = ({ reservations, blocks, onOpenAll }: { reservations: ReservationRecord[]; blocks: AvailabilityBlock[]; onOpenAll: () => void }) => {
  const items: AgendaItem[] = [
    ...reservations.map((reservation): AgendaItem => ({ id: reservation.id, time: reservation.startTime, title: reservation.customerName, detail: reservation.fieldName, status: reservation.status === "pending" ? "pending" : "confirmed" })),
    ...blocks.map((block): AgendaItem => ({ id: block.id, time: block.startTime, title: block.label, detail: block.fieldName, status: "blocked" })),
  ].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 3);

  if (items.length === 0) return null;

  return (
    <AppSection title="Agenda de hoy" actionLabel="Ver agenda" onAction={onOpenAll}>
      <View style={styles.list}>
        {items.map((item, index) => <AgendaRow key={item.id} item={item} showDivider={index < items.length - 1} />)}
      </View>
    </AppSection>
  );
};

const AgendaRow = ({ item, showDivider }: { item: AgendaItem; showDivider: boolean }) => (
  <View style={[styles.row, showDivider && styles.divider]}>
    <CustomText text={item.time} variant="actionSecondary" style={styles.time} />
    <View style={styles.copy}>
      <CustomText text={item.title} variant="body" style={styles.title} numberOfLines={1} />
      <CustomText text={item.detail} variant="caption" style={styles.detail} numberOfLines={1} />
    </View>
    <ScheduleStatusLabel status={item.status} />
  </View>
);

export default TodayAgendaPreview;

const styles = StyleSheet.create({
  list: { paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.separatorOnDark },
  time: { width: 50, color: theme.colors.white },
  copy: { flex: 1, minWidth: 0 },
  title: { color: theme.colors.white },
  detail: { color: theme.colors.authTextSecondary },
});
