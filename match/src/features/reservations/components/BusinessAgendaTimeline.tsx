import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { getReservationCustomerLabel } from "@/src/features/reservations/utils/reservationIdentity";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { memo, useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from "react-native";

interface BusinessAgendaTimelineProps {
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
  openingTime?: string;
  closingTime?: string;
  focusedReservationId?: string | null;
  focusedAvailableStartTime?: string | null;
  onFocusedItemLayout?: (layout: { y: number; height: number }) => void;
  focusRequestKey?: number;
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

const BusinessAgendaTimeline = ({ reservations, blocks, openingTime = "16:00", closingTime = "23:00", focusedReservationId, focusedAvailableStartTime, onFocusedItemLayout, focusRequestKey, onPressReservation, onPressAvailable, onPressBlock }: BusinessAgendaTimelineProps) => {
  const scheduleY = useRef<number | null>(null);
  const rowsY = useRef<number | null>(null);
  const itemLayouts = useRef(new Map<string, { y: number; height: number }>());
  const focusedItemKey = focusedReservationId
    ? `reservation:${focusedReservationId}`
    : focusedAvailableStartTime
      ? `available:${focusedAvailableStartTime}`
      : null;
  const reportItemLayout = useCallback((itemKey: string | null) => {
    if (scheduleY.current === null || rowsY.current === null || !itemKey) return;
    const itemLayout = itemLayouts.current.get(itemKey);
    if (!itemLayout) return;
    onFocusedItemLayout?.({
      y: scheduleY.current + rowsY.current + itemLayout.y,
      height: itemLayout.height,
    });
  }, [onFocusedItemLayout]);
  const reportFocusedLayout = useCallback(() => {
    reportItemLayout(focusedItemKey);
  }, [focusedItemKey, reportItemLayout]);

  useEffect(() => {
    if (!focusRequestKey) return;
    const animationFrame = requestAnimationFrame(reportFocusedLayout);
    return () => cancelAnimationFrame(animationFrame);
  }, [focusRequestKey, reportFocusedLayout]);
  const captureScheduleLayout = (event: LayoutChangeEvent) => {
    scheduleY.current = event.nativeEvent.layout.y;
    reportFocusedLayout();
  };
  const captureRowsLayout = (event: LayoutChangeEvent) => {
    rowsY.current = event.nativeEvent.layout.y;
    reportFocusedLayout();
  };
  const captureItemLayout = (itemKey: string, event: LayoutChangeEvent) => {
    itemLayouts.current.set(itemKey, event.nativeEvent.layout);
    if (itemKey === focusedItemKey) reportItemLayout(itemKey);
  };
  const events: ScheduleEvent[] = [
    ...reservations
      .filter(isActiveReservation)
      .map((reservation) => ({ startTime: reservation.startTime, durationMinutes: reservation.durationMinutes, title: getReservationCustomerLabel(reservation), status: reservation.status, amount: reservation.amount, reservation })),
    ...blocks.map((block) => ({ startTime: block.startTime, durationMinutes: block.durationMinutes, title: block.label, status: block.kind === "maintenance" || block.label.toLocaleLowerCase().includes("mantenimiento") ? ("maintenance" as const) : ("blocked" as const), block })),
  ];
  const rows = buildRows(events, openingTime, closingTime);

  return (
    <View style={styles.schedule} onLayout={captureScheduleLayout} accessibilityLabel="Horarios del día">
      <View style={styles.heading}>
        <CustomText text="Agenda" variant="subtitle" style={styles.title} />
      </View>
      <View onLayout={captureRowsLayout}>
        {rows.map((row) => {
          if (row.kind === "available") {
            const focused = row.startTime === focusedAvailableStartTime;
            const itemKey = `available:${row.startTime}`;
            return <Pressable key={row.startTime} onLayout={(event) => captureItemLayout(itemKey, event)} onPress={() => { reportItemLayout(itemKey); onPressAvailable(row); }} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={`Gestionar horario disponible de ${row.startTime} a ${row.endTime}`} style={({ pressed }) => pressed && styles.pressed}><ScheduleRow startTime={row.startTime} endTime={row.endTime} status="available" focused={focused} /></Pressable>;
          }

          const endTime = addMinutes(row.event.startTime, row.event.durationMinutes);
          const focused = row.event.reservation?.id === focusedReservationId;
          const content = <ScheduleRow startTime={row.event.startTime} endTime={endTime} title={row.event.title} status={row.event.status} amount={row.event.amount} focused={focused} />;
          if (row.event.reservation) {
            const reservationState = row.event.reservation.status === "confirmed" ? "confirmada" : "pendiente";
            const itemKey = `reservation:${row.event.reservation.id}`;
            return <Pressable key={row.event.reservation.id} onLayout={(event) => captureItemLayout(itemKey, event)} onPress={() => { reportItemLayout(itemKey); onPressReservation(row.event.reservation!); }} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={`Gestionar reserva ${reservationState} de ${row.event.reservation.customerName}`} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable>;
          }
          if (!row.event.block) return null;
          const itemKey = `block:${row.event.block.id}`;
          return <Pressable key={row.event.block.id} onLayout={(event) => captureItemLayout(itemKey, event)} onPress={() => { reportItemLayout(itemKey); onPressBlock(row.event.block!); }} accessibilityRole="button" accessibilityLabel={`Liberar horario bloqueado de ${row.event.block.startTime}`} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable>;
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
        <View style={[styles.node, styles[`${status}Node`]]} />
      </View>
      <View style={[styles.row, isReservation && styles.reservationCard, status === "confirmed" && styles.confirmedCard]}>
        {focused ? <View pointerEvents="none" style={styles.focusBorder} /> : null}
        {isReservation ? <SportsAvatar seed={title ?? "Cliente"} /> : null}
        <View style={styles.copy}>
          {isReservation ? <CustomText text={title ?? "Cliente"} variant="body" style={[styles.eventTitle, styles[`${status}Title`]]} numberOfLines={1} ellipsizeMode="tail" /> : null}
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
  availableNode: { backgroundColor: theme.colors.surfaceMuted },
  confirmedNode: { backgroundColor: theme.colors.accent },
  pendingNode: { backgroundColor: theme.colors.pendingLimeText },
  blockedNode: { backgroundColor: theme.colors.error },
  maintenanceNode: { backgroundColor: theme.colors.warmAmber },
  row: { flex: 1, minWidth: 0, minHeight: 88, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
  focusBorder: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, borderWidth: 1, borderColor: theme.colors.white, borderRadius: theme.radius.extraLarge, opacity: 0.86 },
  rowSeparator: { position: "absolute", right: 0, bottom: 0, left: 80, height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.separatorOnDark },
  reservationCard: { borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.surface },
  confirmedCard: { backgroundColor: theme.colors.reservedSurface },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  eventTitle: { flexShrink: 1, color: theme.colors.white },
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
