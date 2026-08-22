import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface BusinessAgendaTimelineProps {
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
  openingTime?: string;
  closingTime?: string;
  onPressReservation: (reservation: ReservationRecord) => void;
  onPressAvailable: (slot: { startTime: string; endTime: string }) => void;
  onPressBlock: (block: AvailabilityBlock) => void;
}

type ScheduleStatus = "available" | "reserved" | "pending" | "blocked";
type ScheduleEvent = { startTime: string; durationMinutes: number; title: string; status: Exclude<ScheduleStatus, "available">; amount?: number; reservation?: ReservationRecord; block?: AvailabilityBlock };
type ScheduleRowData = { kind: "available"; startTime: string; endTime: string } | { kind: "event"; event: ScheduleEvent };

const slotMinutes = 60;

const addMinutes = (time: string, minutesToAdd: number) => {
  const [hour, minute] = time.split(":").map(Number);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
};

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const createTimeSlots = (openingTime: string, closingTime: string) => Array.from({ length: Math.max(0, Math.ceil((toMinutes(closingTime) - toMinutes(openingTime)) / slotMinutes)) }, (_, index) => {
  const startTime = addMinutes(openingTime, index * slotMinutes);
  return { startTime, endTime: addMinutes(startTime, slotMinutes) };
});

const buildRows = (events: ScheduleEvent[], openingTime: string, closingTime: string): ScheduleRowData[] => {
  const eventsByStartTime = new Map(events.map((event) => [event.startTime, event]));
  const slots = createTimeSlots(openingTime, closingTime);
  const rows: ScheduleRowData[] = [];

  for (let index = 0; index < slots.length;) {
    const slot = slots[index];
    const event = eventsByStartTime.get(slot.startTime);
    if (!event) {
      rows.push({ kind: "available", ...slot });
      index += 1;
      continue;
    }
    rows.push({ kind: "event", event });
    index += Math.max(1, Math.ceil(event.durationMinutes / slotMinutes));
  }
  return rows;
};

const BusinessAgendaTimeline = ({ reservations, blocks, openingTime = "16:00", closingTime = "23:00", onPressReservation, onPressAvailable, onPressBlock }: BusinessAgendaTimelineProps) => {
  const events: ScheduleEvent[] = [
    ...reservations.map((reservation) => ({ startTime: reservation.startTime, durationMinutes: reservation.durationMinutes, title: reservation.customerName, status: reservation.status === "pending" ? ("pending" as const) : ("reserved" as const), amount: reservation.amount, reservation })),
    ...blocks.map((block) => ({ startTime: block.startTime, durationMinutes: block.durationMinutes, title: block.label, status: "blocked" as const, block })),
  ];
  const rows = buildRows(events, openingTime, closingTime);

  return (
    <View style={styles.schedule} accessibilityLabel="Horarios del día">
      <View style={styles.heading}>
        <CustomText text="Agenda" variant="subtitle" style={styles.title} />
      </View>
      <View style={styles.rows}>
        {rows.map((row) => {
          if (row.kind === "available") {
            return <Pressable key={row.startTime} onPress={() => onPressAvailable(row)} accessibilityRole="button" accessibilityLabel={`Bloquear horario de ${row.startTime} a ${row.endTime}`} style={({ pressed }) => pressed && styles.pressed}><ScheduleRow startTime={row.startTime} endTime={row.endTime} status="available" /></Pressable>;
          }

          const endTime = addMinutes(row.event.startTime, row.event.durationMinutes);
          const content = <ScheduleRow startTime={row.event.startTime} endTime={endTime} title={row.event.title} status={row.event.status} amount={row.event.amount} />;
          if (row.event.reservation) {
            return <Pressable key={row.event.reservation.id} onPress={() => onPressReservation(row.event.reservation!)} accessibilityRole="button" accessibilityLabel={`Gestionar reserva de ${row.event.reservation.customerName}`} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable>;
          }
          return row.event.block ? <Pressable key={row.event.block.id} onPress={() => onPressBlock(row.event.block!)} accessibilityRole="button" accessibilityLabel={`Liberar horario bloqueado de ${row.event.block.startTime}`} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable> : null;
        })}
      </View>
    </View>
  );
};

const ScheduleRow = ({ startTime, endTime, title, status, amount }: { startTime: string; endTime: string; title?: string; status: ScheduleStatus; amount?: number }) => {
  const isReservation = status === "reserved" || status === "pending";
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timeColumn}>
        <CustomText text={startTime} variant="caption" style={styles.time} />
        <CustomText text={endTime} variant="label" style={styles.endTime} />
      </View>
      <View style={styles.track}>
        <View style={styles.trackLine} />
        <View style={[styles.node, styles[`${status}Node`]]} />
      </View>
      <View style={[styles.row, isReservation && styles.reservationCard, status === "reserved" && styles.confirmedCard]}>
        {isReservation ? <SportsAvatar seed={title ?? "Cliente"} /> : null}
        <View style={styles.copy}>
          <CustomText text={title ?? "Libre"} variant={title ? "body" : "caption"} style={[styles.eventTitle, styles[`${status}Title`]]} numberOfLines={1} />
          {isReservation ? <ScheduleStatusLabel status={status === "pending" ? "pending" : "confirmed"} /> : null}
        </View>
        {isReservation && amount !== undefined ? (
          <View style={styles.amount}>
            <CustomText text="S/" variant="label" style={styles.currency} />
            <CustomText text={String(amount)} variant="actionSecondary" style={styles.amountValue} numberOfLines={1} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default memo(BusinessAgendaTimeline);

const styles = StyleSheet.create({
  schedule: { gap: theme.spacing.lg },
  heading: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: theme.spacing.md },
  title: { color: theme.colors.white },
  rows: { marginLeft: -theme.spacing.xs },
  timelineRow: { minHeight: 100, flexDirection: "row", alignItems: "stretch", marginBottom: theme.spacing.sm },
  timeColumn: { width: 60, alignItems: "flex-end", justifyContent: "center", paddingRight: theme.spacing.sm },
  time: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold },
  endTime: { color: theme.colors.authTextSecondary, fontSize: 11, lineHeight: 14 },
  track: { width: 20, alignItems: "center", justifyContent: "center" },
  trackLine: { position: "absolute", top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: theme.colors.dividerOnDark },
  node: { width: 10, height: 10, borderRadius: theme.radius.pill, borderWidth: 2, borderColor: theme.colors.black },
  availableNode: { backgroundColor: theme.colors.surfaceMuted },
  reservedNode: { backgroundColor: theme.colors.electricBlue },
  pendingNode: { backgroundColor: theme.colors.accent },
  blockedNode: { backgroundColor: theme.colors.errorSoft },
  row: { flex: 1, minWidth: 0, minHeight: 88, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.separatorOnDark },
  reservationCard: { borderBottomWidth: 0, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.surface },
  confirmedCard: { backgroundColor: theme.colors.reservedSurface },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  eventTitle: { color: theme.colors.white },
  availableTitle: { color: theme.colors.authTextSecondary },
  reservedTitle: { color: theme.colors.white },
  pendingTitle: { color: theme.colors.white },
  blockedTitle: { color: theme.colors.textOnDarkSecondary },
  amount: { flexShrink: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.textOnDarkSecondary },
  amountValue: { color: theme.colors.white },
  pressed: { opacity: 0.76 },
});
