import AppKeyboardAwareScrollView from "@/src/components/ui/AppKeyboardAwareScrollView";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import ReservationSheetNotice from "@/src/features/reservations/components/ReservationSheetNotice";
import ReservationCustomerPicker from "@/src/features/reservations/components/ReservationCustomerPicker";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationStatusSelector from "@/src/features/reservations/components/ReservationStatusSelector";
import ReservationSheetDetails from "@/src/features/reservations/components/ReservationSheetDetails";
import ReservationPriceSummary from "@/src/features/reservations/components/ReservationPriceSummary";
import ReservationTimeRange from "@/src/features/reservations/components/ReservationTimeRange";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import { reservationCustomers } from "@/src/features/reservations/data/reservationCustomers";
import { useReservationCommands } from "@/src/features/reservations/hooks/useReservationCommands";
import type { ReservationCreateStatus, ReservationCustomer } from "@/src/features/reservations/types/reservation";
import { parseBusinessReservationCreateParams } from "@/src/features/reservations/utils/businessReservationCreateRoute";
import { getTimeRangeDuration } from "@/src/features/reservations/utils/reservationTime";
import { getReservationActionErrorMessage } from "@/src/features/reservations/utils/getReservationActionErrorMessage";
import { getBusinessAgendaAccess } from "@/src/features/reservations/utils/businessAgendaAccess";
import { hasAgendaSlotStarted } from "@/src/features/reservations/utils/reservationDate";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import { COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BusinessReservationCreateView = () => {
  const insets = useSafeAreaInsets();
  const params = parseBusinessReservationCreateParams(useLocalSearchParams<{
    venueId?: string | string[];
    venueName?: string | string[];
    fieldId?: string | string[];
    fieldName?: string | string[];
    dateKey?: string | string[];
    dateLabel?: string | string[];
    startTime?: string | string[];
    endTime?: string | string[];
    hourlyPrice?: string | string[];
  }>());
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<ReservationCustomer | null>(null);
  const [reservationStatus, setReservationStatus] = useState<ReservationCreateStatus>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { draft } = useBusinessDraft({ redirectWhenMissing: false });
  const { createReservation, isMutating } = useReservationCommands(draft?.organizationId);
  const { effectiveRole } = useEffectiveBusinessMembership(draft?.membership);
  const agendaAccess = getBusinessAgendaAccess(effectiveRole);
  const field = draft?.fields.find((item) => item.fieldId === params.fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);
  const durationMinutes = getTimeRangeDuration(params.startTime ?? "", params.endTime ?? "");
  const hourlyPrice = Number(params.hourlyPrice ?? 0);
  const hasValidPrice = Number.isFinite(hourlyPrice) && hourlyPrice >= 0;
  const amount = durationMinutes === null || !hasValidPrice
    ? 0
    : Math.round(hourlyPrice * durationMinutes / 60 * 100) / 100;
  const hasContext = Boolean(params.venueId && params.fieldId && params.dateKey && params.startTime && params.endTime && durationMinutes !== null && hasValidPrice);
  const resourceOperational = field?.status === "active" && venue?.status === "active";
  const slotStarted = Boolean(params.dateKey && params.startTime && hasAgendaSlotStarted(params.dateKey, params.startTime));
  const canCreate = agendaAccess.canCreateReservation && resourceOperational && !slotStarted;

  const handleCreate = async () => {
    if (!canCreate) {
      setErrorMessage(slotStarted ? "Este horario ya comenzó o pertenece al pasado." : "La sede o la cancha no están disponibles para crear reservas.");
      return;
    }
    const customerName = selectedCustomer?.displayName ?? customerQuery.trim();
    if (customerName.length < 2) {
      setErrorMessage("Ingresa el nombre del cliente.");
      return;
    }
    if (!hasContext || !params.venueId || !params.fieldId || !params.dateKey || !params.startTime || durationMinutes === null) {
      setErrorMessage("No pudimos recuperar este horario.");
      return;
    }
    let reservation;
    try {
      reservation = await createReservation({
        customerId: selectedCustomer?.id ?? null,
        venueId: params.venueId,
        venueName: params.venueName ?? "Club",
        fieldId: params.fieldId,
        fieldName: params.fieldName ?? "Cancha",
        dateKey: params.dateKey,
        dateLabel: params.dateLabel ?? params.dateKey,
        startTime: params.startTime,
        durationMinutes,
        amount,
        customerName,
        status: reservationStatus,
        source: "manual",
        paymentStatus: "pay_at_venue",
      });
    } catch (createError) {
      setErrorMessage(getReservationActionErrorMessage(createError, "No pudimos crear la reserva."));
      return;
    }
    if (!reservation) {
      setErrorMessage("No pudimos crear la reserva. Revisa que el horario siga disponible.");
      return;
    }
    router.back();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppScreenHeader
        title="Nueva reserva"
        titleAlign="center"
        titleSize="compact"
        onBack={() => router.back()}
        backIconVariant="dismiss"
        backAccessibilityLabel="Cerrar nueva reserva"
      />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.keyboardArea}>
          <AppKeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              { paddingTop: insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT + theme.spacing.lg },
            ]}
            showsVerticalScrollIndicator={false}
          >
        <View style={styles.context}>
          <ScheduleStatusLabel status="available" tone="accent" />
          <ReservationTimeRange startTime={params.startTime ?? "--:--"} endTime={params.endTime} tone="available" />
          <ReservationSheetDetails
            divided={false}
            items={[
              { label: "Cancha", value: params.fieldName ?? "Cancha" },
              { label: "Fecha", value: params.dateLabel ?? "Fecha por definir" },
            ]}
          />
        </View>

        <View style={styles.form}>
          <ReservationCustomerPicker
            customers={reservationCustomers}
            query={customerQuery}
            selectedCustomerId={selectedCustomer?.id ?? null}
            onChangeQuery={(query) => {
              setCustomerQuery(query);
              setSelectedCustomer(null);
              setErrorMessage(null);
            }}
            onSelect={(customer) => {
              setSelectedCustomer(customer);
              setCustomerQuery(customer.displayName);
              setErrorMessage(null);
            }}
            allowManualEntry
          />
          {errorMessage ? <ReservationSheetNotice message={errorMessage} /> : null}
          {!canCreate && !errorMessage ? <ReservationSheetNotice tone="readOnly" message={slotStarted ? "Este horario ya comenzó o pertenece al pasado." : "No puedes crear reservas mientras la sede o la cancha estén inactivas."} /> : null}
        </View>

        <ReservationStatusSelector value={reservationStatus} onChange={setReservationStatus} />

        <ReservationPriceSummary amount={amount} />

          </AppKeyboardAwareScrollView>
          <View style={styles.footer}>
            <ReservationSheetActionButton label="Crear reserva" onPress={() => void handleCreate()} disabled={!hasContext || !canCreate || customerQuery.trim().length < 2 || isMutating} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BusinessReservationCreateView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  keyboardArea: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenGutter,
    paddingBottom: theme.spacing.lg,
    gap: theme.layout.sectionGap,
  },
  context: { gap: theme.spacing.lg },
  form: { gap: theme.spacing.sm },
  footer: { paddingHorizontal: theme.layout.screenGutter, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.md },
});
