import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface BusinessAgendaTimelineProps {
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
  openingTime?: string;
  closingTime?: string;
  focusedReservationId?: string | null;
  onPressReservation: (reservation: ReservationRecord) => void;
  onPressAvailable: (slot: { startTime: string; endTime: string }) => void;
  onPressBlock: (block: AvailabilityBlock) => void;
}

type ScheduleStatus = "available" | "confirmed" | "pending" | "blocked" | "maintenance";
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

const fromMinutes = (totalMinutes: number) => `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;

const appendAvailableRows = (rows: ScheduleRowData[], startMinutes: number, endMinutes: number) => {
  for (let cursor = startMinutes; cursor < endMinutes; cursor += slotMinutes) {
    rows.push({ kind: "available", startTime: fromMinutes(cursor), endTime: fromMinutes(Math.min(cursor + slotMinutes, endMinutes)) });
  }
};

const buildRows = (events: ScheduleEvent[], openingTime: string, closingTime: string): ScheduleRowData[] => {
  const rows: ScheduleRowData[] = [];
  const openingMinutes = toMinutes(openingTime);
  const closingMinutes = toMinutes(closingTime);
  const sortedEvents = [...events]
    .filter((event) => {
      const eventStart = toMinutes(event.startTime);
      const eventEnd = eventStart + event.durationMinutes;
      return eventStart < closingMinutes && eventEnd > openingMinutes;
    })
    .sort((first, second) => toMinutes(first.startTime) - toMinutes(second.startTime));
  let cursor = openingMinutes;

  sortedEvents.forEach((event) => {
    const eventStart = toMinutes(event.startTime);
    const eventEnd = eventStart + event.durationMinutes;
    if (eventStart > cursor) appendAvailableRows(rows, cursor, eventStart);
    rows.push({ kind: "event", event });
    cursor = Math.max(cursor, eventEnd);
  });

  if (cursor < closingMinutes) appendAvailableRows(rows, cursor, closingMinutes);
  return rows;
};

const BusinessAgendaTimeline = ({ reservations, blocks, openingTime = "16:00", closingTime = "23:00", focusedReservationId, onPressReservation, onPressAvailable, onPressBlock }: BusinessAgendaTimelineProps) => {
  const events: ScheduleEvent[] = [
    ...reservations
      .filter(isActiveReservation)
      .map((reservation) => ({ startTime: reservation.startTime, durationMinutes: reservation.durationMinutes, title: reservation.customerName, status: reservation.status, amount: reservation.amount, reservation })),
    ...blocks.map((block) => ({ startTime: block.startTime, durationMinutes: block.durationMinutes, title: block.label, status: block.kind === "maintenance" || block.label.toLocaleLowerCase().includes("mantenimiento") ? ("maintenance" as const) : ("blocked" as const), block })),
  ];
  const rows = buildRows(events, openingTime, closingTime);

  return (
    <View style={styles.schedule} accessibilityLabel="Horarios del día">
      <View style={styles.heading}>
        <CustomText text="Agenda" variant="subtitle" style={styles.title} />
      </View>
      <View>
        {rows.map((row) => {
          if (row.kind === "available") {
            return <Pressable key={row.startTime} onPress={() => onPressAvailable(row)} accessibilityRole="button" accessibilityLabel={`Bloquear horario de ${row.startTime} a ${row.endTime}`} style={({ pressed }) => pressed && styles.pressed}><ScheduleRow startTime={row.startTime} endTime={row.endTime} status="available" /></Pressable>;
          }

          const endTime = addMinutes(row.event.startTime, row.event.durationMinutes);
          const focused = row.event.reservation?.id === focusedReservationId;
          const content = <ScheduleRow startTime={row.event.startTime} endTime={endTime} title={row.event.title} status={row.event.status} amount={row.event.amount} focused={focused} />;
          if (row.event.reservation) {
            const reservationState = row.event.reservation.status === "confirmed" ? "confirmada" : "pendiente";
            return <Pressable key={row.event.reservation.id} onPress={() => onPressReservation(row.event.reservation!)} accessibilityRole="button" accessibilityLabel={`Gestionar reserva ${reservationState} de ${row.event.reservation.customerName}`} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable>;
          }
          return row.event.block ? <Pressable key={row.event.block.id} onPress={() => onPressBlock(row.event.block!)} accessibilityRole="button" accessibilityLabel={`Liberar horario bloqueado de ${row.event.block.startTime}`} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable> : null;
        })}
      </View>
    </View>
  );
};

const ScheduleRow = ({ startTime, endTime, title, status, amount, focused = false }: { startTime: string; endTime: string; title?: string; status: ScheduleStatus; amount?: number; focused?: boolean }) => {
  const isReservation = status === "confirmed" || status === "pending";
  const usesStatusBadge = status === "blocked" || status === "maintenance";
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timeColumn}>
        <CustomText text={startTime} variant="caption" style={styles.time} />
        <CustomText text={endTime} variant="label" style={styles.endTime} />
      </View>
      <View style={styles.track}>
        <View style={styles.trackLine} />
        <View style={[styles.node, styles[`${status}Node`], focused && styles.focusedNode]} />
      </View>
      <View style={[styles.row, isReservation && styles.reservationCard, status === "confirmed" && styles.confirmedCard]}>
        {isReservation ? <SportsAvatar seed={title ?? "Cliente"} /> : null}
        <View style={styles.copy}>
          {isReservation ? <CustomText text={title ?? "Cliente"} variant="body" style={[styles.eventTitle, styles[`${status}Title`]]} numberOfLines={1} /> : null}
          <ScheduleStatusLabel status={status} variant={usesStatusBadge ? "badge" : "text"} emphasis={isReservation ? "regular" : "compact"} />
        </View>
        {isReservation && amount !== undefined ? (
          <View style={styles.amount}>
            <CustomText text="S/" variant="label" style={styles.currency} />
            <CustomText text={formatMoneyAmount(amount)} variant="actionSecondary" style={styles.amountValue} numberOfLines={1} />
          </View>
        ) : null}
      </View>
      <View pointerEvents="none" style={styles.rowSeparator} />
    </View>
  );
};

export default memo(BusinessAgendaTimeline);

const styles = StyleSheet.create({
  schedule: { gap: theme.spacing.lg },
  heading: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: theme.spacing.md },
  title: { color: theme.colors.white },
  timelineRow: { position: "relative", minHeight: 108, flexDirection: "row", alignItems: "stretch", paddingVertical: theme.spacing.xs },
  timeColumn: { width: 60, alignItems: "flex-end", justifyContent: "center", paddingRight: theme.spacing.sm },
  time: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold },
  endTime: { color: theme.colors.authTextSecondary, fontSize: 11, lineHeight: 14 },
  track: { width: 20, alignItems: "center", justifyContent: "center" },
  trackLine: { position: "absolute", top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: theme.colors.dividerOnDark },
  node: { width: 10, height: 10, borderRadius: theme.radius.pill, borderWidth: 2, borderColor: theme.colors.black },
  focusedNode: { width: 14, height: 14, borderWidth: 3, borderColor: theme.colors.white },
  availableNode: { backgroundColor: theme.colors.surfaceMuted },
  confirmedNode: { backgroundColor: theme.colors.accent },
  pendingNode: { backgroundColor: theme.colors.pendingLimeText },
  blockedNode: { backgroundColor: theme.colors.errorSoft },
  maintenanceNode: { backgroundColor: theme.colors.warmAmber },
  row: { flex: 1, minWidth: 0, minHeight: 88, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
  rowSeparator: { position: "absolute", right: 0, bottom: 0, left: 80, height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.separatorOnDark },
  reservationCard: { borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.surface },
  confirmedCard: { backgroundColor: theme.colors.reservedSurface },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  eventTitle: { color: theme.colors.white },
  availableTitle: { color: theme.colors.authTextSecondary },
  confirmedTitle: { color: theme.colors.white },
  pendingTitle: { color: theme.colors.white },
  blockedTitle: { color: theme.colors.textOnDarkSecondary },
  maintenanceTitle: { color: theme.colors.warmAmber },
  amount: { flexShrink: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.textOnDarkSecondary },
  amountValue: { color: theme.colors.white },
  pressed: { opacity: 0.76 },
});
