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
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";

const getRouteParam = (param: string | string[] | undefined) => Array.isArray(param) ? param[0] : param;

const BusinessReservationsView = () => {
  const routeParams = useLocalSearchParams<{ reservationId?: string | string[]; dateKey?: string | string[]; fieldId?: string | string[] }>();
  const initialDateKey = getRouteParam(routeParams.dateKey) ?? reservationDates[0].dateKey;
  const initialFieldId = getRouteParam(routeParams.fieldId) ?? null;
  const { reservations, blocks } = useReservations();
  const { draft } = useBusinessDraft({ redirectWhenMissing: false });
  const fields = useMemo(
    () => {
      const configuredFields = (draft?.fields ?? []).map((field) => ({
        id: field.fieldId,
        name: field.fieldName,
        venueId: field.venueId,
        openingTime: field.availability?.openingTime,
        closingTime: field.availability?.closingTime,
        hourlyPrice: field.hourlyPrice,
        venueName: draft?.venues.find((venue) => venue.venueId === field.venueId)?.venueName,
      }));
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
  const [availabilityAction, setAvailabilityAction] =
    useState<AvailabilityAction | null>(null);
  const defaultFieldId = fields.find((field) => reservations.some((reservation) => reservation.fieldId === field.id && reservation.status !== "canceled"))?.id ?? fields[0]?.id ?? null;
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
    const reservationId = getRouteParam(routeParams.reservationId);
    if (!reservationId) return;

    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation) return;

    setSelectedDateKey(getRouteParam(routeParams.dateKey) ?? reservation.dateKey);
    setSelectedFieldId(getRouteParam(routeParams.fieldId) ?? reservation.fieldId);
    setFocusedReservationId(reservation.id);
    setSelectedReservation(reservation);
    router.setParams({ reservationId: undefined });
  }, [reservations, routeParams.dateKey, routeParams.fieldId, routeParams.reservationId]);

  return (
    <>
      <AppScreenLayout
        title="Reservas"
        backgroundVariant="dashboard"
        hasTabBar
      >
        <BusinessFieldSelector fields={fields} selectedFieldId={activeFieldId} onSelectField={(fieldId) => {
          setFocusedReservationId(null);
          setSelectedFieldId(fieldId);
        }} />

        <BusinessReservationCalendar selectedDateKey={selectedDateKey} activityCounts={activityCounts} onSelectDate={(dateKey) => {
          setFocusedReservationId(null);
          setSelectedDateKey(dateKey);
        }} />

        <BusinessReservationDaySummary dateLabel={selectedDateLabel} reservationCount={agendaReservations.length} availableHours={availableHours} />

        <BusinessAgendaTimeline
          reservations={agendaReservations}
          blocks={agendaBlocks}
          openingTime={openingTime}
          closingTime={closingTime}
          focusedReservationId={focusedReservationId}
          onPressReservation={(reservation) => {
            setFocusedReservationId(reservation.id);
            setSelectedReservation(reservation);
          }}
          onPressAvailable={(slot) =>
            setAvailabilityAction({ kind: "available", ...slot })
          }
          onPressBlock={(block) =>
            setAvailabilityAction({ kind: "blocked", block })
          }
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
          router.push({
            pathname: "/business/reservations/new",
            params: {
              venueId: activeField.venueId,
              venueName: activeField.venueName ?? "Club",
              fieldId: activeField.id,
              fieldName: activeField.name,
              dateKey: selectedDateKey,
              dateLabel: selectedDateLabel,
              startTime,
              endTime,
              hourlyPrice: String(activeField.hourlyPrice),
            },
          });
        }}
        onBlock={(startTime, kind) => {
          if (!activeField) return;
          reservationsStore.createBlock({
            venueId: activeField.venueId,
            fieldId: activeField.id,
            fieldName: activeField.name,
            dateKey: selectedDateKey,
            startTime,
            durationMinutes: 60,
            label: kind === "maintenance" ? "Mantenimiento" : "Horario bloqueado",
            kind,
          });
          setAvailabilityAction(null);
        }}
        onRelease={(blockId) => {
          reservationsStore.deleteBlock(blockId);
          setAvailabilityAction(null);
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
