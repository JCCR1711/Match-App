import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppScreenState from "@/src/components/ui/AppScreenState";
import AppAccessRestrictedState from "@/src/components/ui/AppAccessRestrictedState";
import AppFeedbackNotice from "@/src/components/ui/AppFeedbackNotice";
import AvailabilityBlockActionsSheet, {
  type AvailabilityAction,
} from "@/src/features/reservations/components/AvailabilityBlockActionsSheet";
import BusinessAgendaSkeleton from "@/src/features/reservations/components/BusinessAgendaSkeleton";
import BusinessAgendaTimeline from "@/src/features/reservations/components/BusinessAgendaTimeline";
import BusinessFieldAgendaSelector from "@/src/features/reservations/components/BusinessFieldAgendaSelector";
import BusinessReservationCalendar from "@/src/features/reservations/components/BusinessReservationCalendar";
import BusinessReservationDaySummary from "@/src/features/reservations/components/BusinessReservationDaySummary";
import BusinessVenueAgendaMenu from "@/src/features/reservations/components/BusinessVenueAgendaMenu";
import ReservationActionsSheet from "@/src/features/reservations/components/ReservationActionsSheet";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservationCommands } from "@/src/features/reservations/hooks/useReservationCommands";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { parseBusinessAgendaParams } from "@/src/features/reservations/utils/businessAgendaRoute";
import { createBusinessReservationHref } from "@/src/features/reservations/utils/businessReservationCreateRoute";
import { getBusinessAgendaAccess } from "@/src/features/reservations/utils/businessAgendaAccess";
import { buildBusinessAgendaFields, findPreferredAgendaField, getBusinessAgendaDay, isAgendaFieldOperational } from "@/src/features/reservations/utils/businessAgendaResources";
import {
  getBusinessBlocks,
  getBusinessReservations,
} from "@/src/features/reservations/utils/getBusinessReservations";
import { getTimeRangeDuration } from "@/src/features/reservations/utils/reservationTime";
import { hasAgendaSlotEnded, hasAgendaSlotStarted } from "@/src/features/reservations/utils/reservationDate";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import BusinessSetupCard from "@/src/features/venues/components/BusinessSetupCard";
import useAppToast from "@/src/hooks/useAppToast";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

const BusinessReservationsView = () => {
  const routeParams = parseBusinessAgendaParams(
    useLocalSearchParams<{
      focusReservationId?: string | string[];
      dateKey?: string | string[];
      fieldId?: string | string[];
      focusStartTime?: string | string[];
    }>(),
  );
  const {
    focusReservationId: routeFocusReservationId,
    dateKey: routeDateKey,
    fieldId: routeFieldId,
    focusStartTime: routeFocusStartTime,
  } = routeParams;
  const initialDateKey = routeDateKey ?? reservationDates[0].dateKey;
  const initialFieldId = routeFieldId ?? null;
  const { draft, loading: draftLoading, error: draftError, reload: reloadDraft } = useBusinessDraft({ redirectWhenMissing: false });
  const { reservations, blocks, loading: reservationsLoading, error: reservationsError, reload: reloadReservations } = useReservations(draft?.organizationId);
  const { confirmReservation, cancelReservation, completeRefund, createBlock, deleteBlock } =
    useReservationCommands(draft?.organizationId);
  const { showToast } = useAppToast();
  const { height: windowHeight } = useWindowDimensions();
  const { effectiveMembership, effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const agendaAccess = getBusinessAgendaAccess(effectiveRole);
  const businessReservations = useMemo(
    () => getBusinessReservations(reservations, draft?.fields ?? []),
    [draft?.fields, reservations],
  );
  const businessBlocks = useMemo(
    () => getBusinessBlocks(blocks, draft?.fields ?? []),
    [blocks, draft?.fields],
  );
  const fields = useMemo(
    () => buildBusinessAgendaFields(draft?.fields ?? [], draft?.venues ?? []),
    [draft?.fields, draft?.venues],
  );
  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    initialFieldId,
  );
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationRecord | null>(null);
  const [focusedReservationId, setFocusedReservationId] = useState<
    string | null
  >(null);
  const [focusedAvailableStartTime, setFocusedAvailableStartTime] = useState<
    string | null
  >(null);
  const [availabilityAction, setAvailabilityAction] =
    useState<AvailabilityAction | null>(null);
  const [scrollToY, setScrollToY] = useState<number | null>(null);
  const [scrollRequestKey, setScrollRequestKey] = useState(0);
  const [focusRequestKey, setFocusRequestKey] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [retainedLoadError, setRetainedLoadError] = useState<string | null>(null);
  const [processedRouteRequest, setProcessedRouteRequest] = useState<string | null>(null);
  const [agendaNow, setAgendaNow] = useState(() => new Date());
  const defaultFieldId =
    findPreferredAgendaField({
      fields,
      reservations: businessReservations,
      dateKey: selectedDateKey,
    })?.id ?? null;
  const selectedField = fields.find((field) => field.id === selectedFieldId);
  const defaultField = fields.find((field) => field.id === defaultFieldId);
  const activeVenueId =
    selectedField?.venueId ??
    selectedVenueId ??
    defaultField?.venueId ??
    draft?.venues[0]?.venueId ??
    null;
  const venueFields = fields.filter((field) => field.venueId === activeVenueId);
  const defaultVenueFieldId =
    findPreferredAgendaField({
      fields: venueFields,
      reservations: businessReservations,
      dateKey: selectedDateKey,
    })?.id ?? null;
  const activeFieldId =
    selectedField?.venueId === activeVenueId
      ? selectedField.id
      : defaultVenueFieldId;
  const activeField = fields.find((field) => field.id === activeFieldId);
  const venueOptions = useMemo(
    () =>
      (draft?.venues ?? [])
        .map((venue) => ({
          id: venue.venueId,
          name: venue.venueName,
          fields: fields.filter((field) => field.venueId === venue.venueId),
        })),
    [draft?.venues, fields],
  );
  const activityByDate = useMemo(
    () =>
      businessReservations.reduce((counts, reservation) => {
        if (
          reservation.fieldId === activeFieldId &&
          reservation.status !== "canceled"
        )
          {
            const current = counts.get(reservation.dateKey) ?? { total: 0, pending: 0 };
            counts.set(reservation.dateKey, {
              total: current.total + 1,
              pending: current.pending + (reservation.status === "pending" ? 1 : 0),
            });
          }
        return counts;
      }, new Map<string, { total: number; pending: number }>()),
    [activeFieldId, businessReservations],
  );
  const agendaDay = getBusinessAgendaDay({
    field: activeField,
    reservations: businessReservations,
    blocks: businessBlocks,
    dateKey: selectedDateKey,
    now: agendaNow,
  });
  const agendaReservations = agendaDay.reservations;
  const agendaBlocks = agendaDay.blocks;
  const availableHours = agendaDay.availableHours;
  const selectedDayHasEvents =
    agendaReservations.length > 0 || agendaBlocks.length > 0;
  const activeFieldOperational = isAgendaFieldOperational(activeField);
  const selectedDateLabel = formatSelectedDate(selectedDateKey);
  const loading = draftLoading || reservationsLoading || planLoading;
  const loadError = draftError ?? reservationsError ?? retainedLoadError;
  const selectedReservationStarted = selectedReservation
    ? hasAgendaSlotStarted(selectedReservation.dateKey, selectedReservation.startTime, agendaNow)
    : false;
  const selectedReservationEnded = selectedReservation
    ? hasAgendaSlotEnded(selectedReservation.dateKey, selectedReservation.startTime, selectedReservation.durationMinutes, agendaNow)
    : false;
  const canManageSelectedReservation = agendaAccess.canManageReservations && !selectedReservationStarted;
  const selectedReservationNeedsRefundPermission = selectedReservation?.paymentStatus === "paid";
  const selectedBlockStarted = availabilityAction?.kind === "blocked"
    ? hasAgendaSlotStarted(selectedDateKey, availabilityAction.block.startTime, agendaNow)
    : false;

  const retryAgenda = async () => {
    if (retrying) return;
    setRetainedLoadError(draftError ?? reservationsError);
    setRetrying(true);
    await Promise.allSettled([reloadDraft(), reloadReservations()]);
    setRetrying(false);
    setRetainedLoadError(null);
  };

  const routeRequestKey = [routeDateKey, routeFieldId, routeFocusStartTime, routeFocusReservationId]
    .map((value) => value ?? "")
    .join("|");
  const hasRouteRequest = Boolean(routeDateKey || routeFieldId || routeFocusStartTime || routeFocusReservationId);
  const routeFocusedReservation = routeFocusReservationId
      ? businessReservations.find((item) => item.id === routeFocusReservationId)
      : null;
  const canProcessRouteRequest = hasRouteRequest
    && (!routeFocusReservationId || Boolean(routeFocusedReservation) || !reservationsLoading);

  if (!hasRouteRequest && processedRouteRequest !== null) {
    setProcessedRouteRequest(null);
  } else if (canProcessRouteRequest && processedRouteRequest !== routeRequestKey) {
    setProcessedRouteRequest(routeRequestKey);
    if (routeDateKey || routeFocusedReservation)
      setSelectedDateKey(routeDateKey ?? routeFocusedReservation!.dateKey);
    if (routeFieldId || routeFocusedReservation)
      setSelectedFieldId(routeFieldId ?? routeFocusedReservation!.fieldId);
    const requestedField = fields.find(
      (field) => field.id === (routeFieldId ?? routeFocusedReservation?.fieldId),
    );
    if (requestedField) setSelectedVenueId(requestedField.venueId);
    setFocusedReservationId(routeFocusedReservation?.id ?? null);
    setSelectedReservation(null);
    setFocusedAvailableStartTime(routeFocusStartTime ?? null);
    if (routeFocusedReservation || routeFocusStartTime) {
      setFocusRequestKey((current) => current + 1);
    }
  }

  useEffect(() => {
    if (!hasRouteRequest || processedRouteRequest !== routeRequestKey) return;
    router.setParams({
      dateKey: undefined,
      fieldId: undefined,
      focusStartTime: undefined,
      focusReservationId: undefined,
    });
  }, [hasRouteRequest, processedRouteRequest, routeRequestKey]);

  useEffect(() => {
    const interval = setInterval(() => setAgendaNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const selectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    const nextFields = fields.filter((field) => field.venueId === venueId);
    const nextField = findPreferredAgendaField({
      fields: nextFields,
      reservations: businessReservations,
      dateKey: selectedDateKey,
    });
    setSelectedFieldId(nextField?.id ?? null);
    setFocusedReservationId(null);
    setFocusedAvailableStartTime(null);
  };

  return (
    <>
      <AppScreenLayout
        title="Reservas"
        backgroundVariant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "dashboard"}
        hasTabBar
        headerAction={effectiveMembership.enabled && venueOptions.length > 0 ? <BusinessVenueAgendaMenu venues={venueOptions} selectedVenueId={activeVenueId} onSelect={selectVenue} /> : null}
        headerActionWidth={effectiveMembership.enabled && venueOptions.length > 0 ? 152 : undefined}
        scrollToY={scrollToY}
        scrollRequestKey={scrollRequestKey}
      >
        {loading ? (
          <BusinessAgendaSkeleton />
        ) : loadError ? (
          <AppScreenState
            kind="error"
            title="No pudimos cargar la agenda"
            message={loadError}
            actionLabel={retrying ? "Reintentando..." : "Intentar de nuevo"}
            actionLoading={retrying}
            onAction={() => void retryAgenda()}
          />
        ) : !effectiveMembership.enabled ? (
          <BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} />
        ) : venueOptions.length === 0 ? (
          agendaAccess.canConfigureResources ? (
          <BusinessSetupCard
            kind="venue"
            title="Crea tu primera sede"
            accessibilityLabel="Crear primera sede"
            onPress={() => router.push("/business/venues/new")}
            style={styles.setupCard}
          />
          ) : (
            <AppAccessRestrictedState
              title="Aún no hay sedes"
              message="Un propietario o gestor debe crear la primera sede."
            />
          )
        ) : !activeField ? (
          agendaAccess.canConfigureResources ? (
          <BusinessSetupCard
            kind="field"
            title="Agrega tu cancha"
            accessibilityLabel="Agregar cancha a esta sede"
            onPress={() => activeVenueId && router.push({ pathname: "/business/fields/new", params: { venueId: activeVenueId } })}
            style={styles.setupCard}
          />
          ) : (
            <AppAccessRestrictedState
              title="Esta sede no tiene canchas"
              message="Un propietario o gestor debe agregar una cancha."
            />
          )
        ) : (
          <>
            <BusinessFieldAgendaSelector
              fields={venueFields}
              selectedFieldId={activeFieldId}
              onSelect={(fieldId) => {
                setSelectedFieldId(fieldId);
                setFocusedReservationId(null);
                setFocusedAvailableStartTime(null);
              }}
            />

            {!activeFieldOperational && activeField.schedule ? (
              <AppFeedbackNotice
                tone="info"
                presentation="card"
                title="Solo consulta"
                message={
                  activeField.venueStatus === "inactive"
                    ? "Sede inactiva. Puedes revisar lo registrado."
                    : "Cancha inactiva. Puedes revisar lo registrado."
                }
              />
            ) : null}

            {!activeField.schedule ? (
              agendaAccess.canConfigureResources ? (
                <BusinessSetupCard
                  kind="availability"
                  presentation="neutral"
                  title="Configura el horario"
                  accessibilityLabel={`Configurar horario de ${activeField.name}`}
                  onPress={() =>
                    router.push({
                      pathname: "/business/fields/[fieldId]/availability",
                      params: { fieldId: activeField.id },
                    })
                  }
                />
              ) : (
                <AppAccessRestrictedState
                  title="Horario sin configurar"
                  message="Un propietario o gestor debe definir la disponibilidad de esta cancha."
                />
              )
            ) : null}

            <BusinessReservationCalendar
              selectedDateKey={selectedDateKey}
              activityByDate={activityByDate}
              onSelectDate={(dateKey) => {
                setFocusedReservationId(null);
                setFocusedAvailableStartTime(null);
                setSelectedDateKey(dateKey);
              }}
            />

            {!activeField.schedule && !selectedDayHasEvents ? null :
            !activeFieldOperational && activeField.schedule && !selectedDayHasEvents ? (
              <AppScreenState
                kind="empty"
                presentation="section"
                title="Agenda pausada"
                message="Activa la sede y la cancha para habilitar horarios."
              />
            ) : !agendaDay.isOpen && !selectedDayHasEvents ? (
              <AppScreenState
                kind="empty"
                presentation="section"
                title="Cancha cerrada"
                message="Esta cancha no atiende el día seleccionado."
              />
            ) : (
              <>
                {!agendaDay.isOpen && activeField.schedule ? (
                  <AppFeedbackNotice
                    tone="info"
                    presentation="card"
                    title="Día cerrado"
                    message="Solo se muestra lo ya registrado."
                  />
                ) : null}

                <BusinessReservationDaySummary
                  dateLabel={selectedDateLabel}
                  reservationCount={agendaReservations.length}
                  availableHours={availableHours}
                />

                <BusinessAgendaTimeline
                  reservations={agendaReservations}
                  blocks={agendaBlocks}
                  dateKey={selectedDateKey}
                  now={agendaNow}
                  openingTime={activeField.schedule?.openingTime}
                  closingTime={activeField.schedule?.closingTime}
                  includeAvailableSlots={agendaDay.isOpen && activeFieldOperational}
                  focusedReservationId={focusedReservationId}
                  focusedAvailableStartTime={focusedAvailableStartTime}
                  focusRequestKey={focusRequestKey}
                  onFocusedItemLayout={({ y, height }) => {
                    setScrollToY(
                      Math.max(0, y - windowHeight * 0.5 + height * 0.5),
                    );
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
                    if (!activeFieldOperational || !agendaDay.isOpen) {
                      showToast({
                        message: "Este horario no está disponible para operar.",
                        tone: "info",
                      });
                      return;
                    }
                    setAvailabilityAction({ kind: "available", ...slot });
                  }}
                  onPressBlock={(block) => {
                    setFocusedReservationId(null);
                    setFocusedAvailableStartTime(null);
                    setAvailabilityAction({ kind: "blocked", block });
                  }}
                />
              </>
            )}
          </>
        )}
      </AppScreenLayout>

      <ReservationActionsSheet
        reservation={selectedReservation}
        canManage={canManageSelectedReservation}
        canCancel={canManageSelectedReservation && (!selectedReservationNeedsRefundPermission || agendaAccess.canCancelPaidReservations)}
        canCompleteRefund={canManageSelectedReservation && agendaAccess.canCancelPaidReservations}
        readOnlyMessage={selectedReservationEnded ? "Esta reserva ya finalizó y queda como historial." : selectedReservationStarted ? "Esta reserva está en curso y ya no puede modificarse." : selectedReservationNeedsRefundPermission && !agendaAccess.canCancelPaidReservations ? "Solo un propietario o gestor puede cancelar una reserva pagada." : undefined}
        onClose={() => setSelectedReservation(null)}
        onConfirm={async (reservationId) => {
          const reservation = await confirmReservation(reservationId);
          if (reservation) {
            setSelectedReservation(null);
            showToast({ message: "Reserva confirmada.", tone: "success" });
          }
          return Boolean(reservation);
        }}
        onCancel={async (reservationId) => {
          const reservation = await cancelReservation(reservationId);
          if (reservation) {
            setSelectedReservation(null);
            showToast({
              message: reservation.paymentStatus === "refund_pending"
                ? "Reserva cancelada. Devolución al jugador pendiente."
                : "Reserva cancelada.",
              tone: "success",
            });
          }
          return Boolean(reservation);
        }}
        onCompleteRefund={async (reservationId) => {
          const reservation = await completeRefund(reservationId);
          if (reservation) {
            setSelectedReservation(null);
            showToast({ message: "Devolución registrada.", tone: "success" });
          }
          return Boolean(reservation);
        }}
      />
      <AvailabilityBlockActionsSheet
        action={availabilityAction}
        dateLabel={selectedDateLabel}
        fieldName={activeField?.name}
        canCreateReservation={
          agendaAccess.canCreateReservation &&
          activeFieldOperational &&
          agendaDay.isOpen
        }
        canManageAvailability={
          agendaAccess.canManageAvailability && activeFieldOperational && !selectedBlockStarted
        }
        readOnlyMessage={selectedBlockStarted ? "Este bloqueo ya pasó y no puede modificarse." : undefined}
        onClose={() => setAvailabilityAction(null)}
        onCreateReservation={(startTime, endTime) => {
          if (!activeField) return;
          setAvailabilityAction(null);
          router.push(
            createBusinessReservationHref({
              venueId: activeField.venueId,
              venueName: activeField.venueName ?? "Club",
              fieldId: activeField.id,
              fieldName: activeField.name,
              dateKey: selectedDateKey,
              dateLabel: selectedDateLabel,
              startTime,
              endTime,
              hourlyPrice: String(activeField.hourlyPrice),
            }),
          );
        }}
        onBlock={async (startTime, endTime, kind) => {
          const durationMinutes = getTimeRangeDuration(startTime, endTime);
          if (!activeField || durationMinutes === null) return false;
          const block = await createBlock({
            venueId: activeField.venueId,
            fieldId: activeField.id,
            fieldName: activeField.name,
            dateKey: selectedDateKey,
            startTime,
            durationMinutes,
            label:
              kind === "maintenance" ? "Mantenimiento" : "Horario bloqueado",
            kind,
          });
          if (!block) return false;
          setAvailabilityAction(null);
          showToast({
            message:
              kind === "maintenance"
                ? "Horario marcado para mantenimiento."
                : "Horario bloqueado.",
            tone: "success",
          });
          return true;
        }}
        onRelease={async (blockId) => {
          if (!(await deleteBlock(blockId))) return false;
          setAvailabilityAction(null);
          showToast({ message: "Horario liberado.", tone: "success" });
          return true;
        }}
      />
    </>
  );
};

export default BusinessReservationsView;

const styles = StyleSheet.create({
  setupCard: { marginTop: theme.spacing.md },
});

const formatSelectedDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })
    .format(new Date(year, month - 1, day))
    .replace(".", "");
};
