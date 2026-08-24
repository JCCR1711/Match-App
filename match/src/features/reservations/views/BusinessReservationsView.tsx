import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AvailabilityBlockActionsSheet, {
  type AvailabilityAction,
} from "@/src/features/reservations/components/AvailabilityBlockActionsSheet";
import BusinessAgendaTimeline from "@/src/features/reservations/components/BusinessAgendaTimeline";
import BusinessFieldSelector from "@/src/features/reservations/components/BusinessFieldSelector";
import BusinessReservationCalendar from "@/src/features/reservations/components/BusinessReservationCalendar";
import BusinessReservationDaySummary from "@/src/features/reservations/components/BusinessReservationDaySummary";
import ReservationActionsSheet from "@/src/features/reservations/components/ReservationActionsSheet";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { reservationsStore } from "@/src/features/reservations/services/MockReservationsStore";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { parseBusinessAgendaParams } from "@/src/features/reservations/utils/businessAgendaRoute";
import { createBusinessReservationHref } from "@/src/features/reservations/utils/businessReservationCreateRoute";
import { getTimeRangeDuration } from "@/src/features/reservations/utils/reservationTime";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

const BusinessReservationsView = () => {
  const routeParams = parseBusinessAgendaParams(useLocalSearchParams<{
    focusReservationId?: string | string[];
    dateKey?: string | string[];
    fieldId?: string | string[];
    focusStartTime?: string | string[];
  }>());
  const {
    focusReservationId: routeFocusReservationId,
    dateKey: routeDateKey,
    fieldId: routeFieldId,
    focusStartTime: routeFocusStartTime,
  } = routeParams;
  const initialDateKey = routeDateKey ?? reservationDates[0].dateKey;
  const initialFieldId = routeFieldId ?? null;
  const { reservations, blocks } = useReservations();
  const { height: windowHeight } = useWindowDimensions();
  const { draft } = useBusinessDraft({ redirectWhenMissing: false });
  const fields = useMemo(
    () => {
      const configuredFields = (draft?.fields ?? []).map((field) => {
        const venue = draft?.venues.find((item) => item.venueId === field.venueId);
        const schedule = getEffectiveFieldSchedule(field, venue);
        return {
          id: field.fieldId,
          name: field.fieldName,
          venueId: field.venueId,
          openingTime: schedule?.openingTime,
          closingTime: schedule?.closingTime,
          hourlyPrice: field.hourlyPrice,
          venueName: venue?.venueName,
        };
      });
      const knownIds = new Set(configuredFields.map((field) => field.id));
      const prototypeFields = Array.from(new Map([...reservations, ...blocks].map((item) => [item.fieldId, item])).values())
        .filter((item) => !knownIds.has(item.fieldId))
        .map((item) => ({ id: item.fieldId, name: item.fieldName, venueId: item.venueId, openingTime: undefined, closingTime: undefined, hourlyPrice: 0, venueName: "Club" }));
      return [...configuredFields, ...prototypeFields];
    },
    [blocks, draft?.fields, draft?.venues, reservations],
  );
  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(initialFieldId);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationRecord | null>(null);
  const [focusedReservationId, setFocusedReservationId] = useState<string | null>(null);
  const [focusedAvailableStartTime, setFocusedAvailableStartTime] = useState<string | null>(null);
  const [availabilityAction, setAvailabilityAction] =
    useState<AvailabilityAction | null>(null);
  const [scrollToY, setScrollToY] = useState<number | null>(null);
  const [scrollRequestKey, setScrollRequestKey] = useState(0);
  const [focusRequestKey, setFocusRequestKey] = useState(0);
  const defaultFieldId = fields.find((field) => reservations.some((reservation) =>
    reservation.fieldId === field.id &&
    reservation.dateKey === selectedDateKey &&
    reservation.status !== "canceled"
  ))?.id ?? fields[0]?.id ?? null;
  const activeFieldId = selectedFieldId ?? defaultFieldId;
  const activeField = fields.find((field) => field.id === activeFieldId);
  const activityCounts = useMemo(
    () =>
      reservations.reduce((counts, reservation) => {
        if (reservation.fieldId === activeFieldId && reservation.status !== "canceled") counts.set(reservation.dateKey, (counts.get(reservation.dateKey) ?? 0) + 1);
        return counts;
      }, new Map<string, number>()),
    [activeFieldId, reservations],
  );
  const agendaReservations = reservations
    .filter(isActiveReservation)
    .filter(
      (reservation) =>
        reservation.dateKey === selectedDateKey &&
        reservation.fieldId === activeFieldId,
    );
  const agendaBlocks = blocks.filter(
    (block) =>
      block.dateKey === selectedDateKey && block.fieldId === activeFieldId,
  );
  const openingTime = activeField?.openingTime ?? "16:00";
  const closingTime = activeField?.closingTime ?? "23:00";
  const scheduledMinutes = Math.max(0, toMinutes(closingTime) - toMinutes(openingTime));
  const occupiedMinutes = [...agendaReservations, ...agendaBlocks].reduce((total, item) => total + item.durationMinutes, 0);
  const availableHours = Math.max(0, Math.floor((scheduledMinutes - occupiedMinutes) / 60));
  const selectedDateLabel = formatSelectedDate(selectedDateKey);

  useEffect(() => {
    const focusReservationId = routeFocusReservationId;
    const requestedDateKey = routeDateKey;
    const requestedFieldId = routeFieldId;

    if (!requestedDateKey && !requestedFieldId && !routeFocusStartTime && !focusReservationId) return;
    const focusedReservation = focusReservationId
      ? reservations.find((item) => item.id === focusReservationId)
      : null;
    if (requestedDateKey || focusedReservation) setSelectedDateKey(requestedDateKey ?? focusedReservation!.dateKey);
    if (requestedFieldId || focusedReservation) setSelectedFieldId(requestedFieldId ?? focusedReservation!.fieldId);
    setFocusedReservationId(focusedReservation?.id ?? null);
    setSelectedReservation(null);
    setFocusedAvailableStartTime(routeFocusStartTime ?? null);
    if (focusedReservation || routeFocusStartTime) {
      setFocusRequestKey((current) => current + 1);
    }
    router.setParams({ dateKey: undefined, fieldId: undefined, focusStartTime: undefined, focusReservationId: undefined });
  }, [reservations, routeDateKey, routeFieldId, routeFocusReservationId, routeFocusStartTime]);

  return (
    <>
      <AppScreenLayout
        title="Reservas"
        backgroundVariant="dashboard"
        hasTabBar
        scrollToY={scrollToY}
        scrollRequestKey={scrollRequestKey}
      >
        <BusinessFieldSelector fields={fields} selectedFieldId={activeFieldId} onSelectField={(fieldId) => {
          setFocusedReservationId(null);
          setFocusedAvailableStartTime(null);
          setSelectedFieldId(fieldId);
        }} />

        <BusinessReservationCalendar selectedDateKey={selectedDateKey} activityCounts={activityCounts} onSelectDate={(dateKey) => {
          setFocusedReservationId(null);
          setFocusedAvailableStartTime(null);
          setSelectedDateKey(dateKey);
        }} />

        <BusinessReservationDaySummary dateLabel={selectedDateLabel} reservationCount={agendaReservations.length} availableHours={availableHours} />

        <BusinessAgendaTimeline
          reservations={agendaReservations}
          blocks={agendaBlocks}
          openingTime={openingTime}
          closingTime={closingTime}
          focusedReservationId={focusedReservationId}
          focusedAvailableStartTime={focusedAvailableStartTime}
          focusRequestKey={focusRequestKey}
          onFocusedItemLayout={({ y, height }) => {
            setScrollToY(Math.max(0, y - windowHeight * 0.5 + height * 0.5));
            setScrollRequestKey((current) => current + 1);
          }}
          onPressReservation={(reservation) => {
            setFocusedReservationId(null);
            setFocusedAvailableStartTime(null);
            setSelectedReservation(reservation);
          }}
          onPressAvailable={(slot) => {
            setFocusedReservationId(null);
            setFocusedAvailableStartTime(null);
            setAvailabilityAction({ kind: "available", ...slot });
          }}
          onPressBlock={(block) => {
            setFocusedReservationId(null);
            setFocusedAvailableStartTime(null);
            setAvailabilityAction({ kind: "blocked", block });
          }}
        />
      </AppScreenLayout>

      <ReservationActionsSheet
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onConfirm={(reservationId) => {
          reservationsStore.confirmReservation(reservationId);
          setSelectedReservation(null);
        }}
        onCancel={(reservationId) => {
          reservationsStore.cancelReservation(reservationId);
          setSelectedReservation(null);
        }}
      />
      <AvailabilityBlockActionsSheet
        action={availabilityAction}
        dateLabel={selectedDateLabel}
        fieldName={activeField?.name}
        onClose={() => setAvailabilityAction(null)}
        onCreateReservation={(startTime, endTime) => {
          if (!activeField) return;
          setAvailabilityAction(null);
          router.push(createBusinessReservationHref({
              venueId: activeField.venueId,
              venueName: activeField.venueName ?? "Club",
              fieldId: activeField.id,
              fieldName: activeField.name,
              dateKey: selectedDateKey,
              dateLabel: selectedDateLabel,
              startTime,
              endTime,
              hourlyPrice: String(activeField.hourlyPrice),
          }));
        }}
        onBlock={(startTime, endTime, kind) => {
          const durationMinutes = getTimeRangeDuration(startTime, endTime);
          if (!activeField || durationMinutes === null) return false;
          const block = reservationsStore.createBlock({
            venueId: activeField.venueId,
            fieldId: activeField.id,
            fieldName: activeField.name,
            dateKey: selectedDateKey,
            startTime,
            durationMinutes,
            label: kind === "maintenance" ? "Mantenimiento" : "Horario bloqueado",
            kind,
          });
          if (!block) return false;
          setAvailabilityAction(null);
          return true;
        }}
        onRelease={(blockId) => {
          if (!reservationsStore.deleteBlock(blockId)) return false;
          setAvailabilityAction(null);
          return true;
        }}
      />
    </>
  );
};

export default BusinessReservationsView;

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const formatSelectedDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "short" }).format(new Date(year, month - 1, day)).replace(".", "");
};
