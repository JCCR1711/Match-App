import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AppKeyboardAwareScrollView from "@/src/components/ui/AppKeyboardAwareScrollView";
import ReservationCustomerPicker from "@/src/features/reservations/components/ReservationCustomerPicker";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationStatusSelector from "@/src/features/reservations/components/ReservationStatusSelector";
import ReservationSheetDetails from "@/src/features/reservations/components/ReservationSheetDetails";
import ReservationSheetHeroValue from "@/src/features/reservations/components/ReservationSheetHeroValue";
import ReservationTimeRange from "@/src/features/reservations/components/ReservationTimeRange";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import { reservationCustomers } from "@/src/features/reservations/data/reservationCustomers";
import { reservationsStore } from "@/src/features/reservations/services/MockReservationsStore";
import type { ReservationCreateStatus, ReservationCustomer } from "@/src/features/reservations/types/reservation";
import { parseBusinessReservationCreateParams } from "@/src/features/reservations/utils/businessReservationCreateRoute";
import { getTimeRangeDuration } from "@/src/features/reservations/utils/reservationTime";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessReservationCreateView = () => {
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
  const durationMinutes = getTimeRangeDuration(params.startTime ?? "", params.endTime ?? "");
  const hourlyPrice = Number(params.hourlyPrice ?? 0);
  const hasValidPrice = Number.isFinite(hourlyPrice) && hourlyPrice >= 0;
  const amount = useMemo(
    () => durationMinutes === null || !hasValidPrice ? 0 : Math.round(hourlyPrice * durationMinutes / 60 * 100) / 100,
    [durationMinutes, hasValidPrice, hourlyPrice],
  );
  const hasContext = Boolean(params.venueId && params.fieldId && params.dateKey && params.startTime && params.endTime && durationMinutes !== null && hasValidPrice);

  const handleCreate = () => {
    if (!selectedCustomer) {
      setErrorMessage("Selecciona un jugador de Match.");
      return;
    }
    if (!hasContext || !params.venueId || !params.fieldId || !params.dateKey || !params.startTime || durationMinutes === null) {
      setErrorMessage("No pudimos recuperar este horario.");
      return;
    }
    const reservation = reservationsStore.createReservation({
      customerId: selectedCustomer.id,
      venueId: params.venueId,
      venueName: params.venueName ?? "Club",
      fieldId: params.fieldId,
      fieldName: params.fieldName ?? "Cancha",
      dateKey: params.dateKey,
      dateLabel: params.dateLabel ?? params.dateKey,
      startTime: params.startTime,
      durationMinutes,
      amount,
      customerName: selectedCustomer.displayName,
      status: reservationStatus,
    });
    if (!reservation) {
      setErrorMessage("Este horario ya no está disponible.");
      return;
    }
    router.back();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.keyboardArea}>
          <View style={styles.modalHeader}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Cerrar nueva reserva"
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <CustomIcon icon={ArrowDown01Icon} color={theme.colors.white} size={24} strokeWidth={3} />
            </Pressable>
            <View pointerEvents="none" style={styles.titleContainer}>
              <CustomText text="Nueva reserva" variant="body" style={styles.title} />
            </View>
          </View>

          <AppKeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
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
          />
          {errorMessage ? <CustomText text={errorMessage} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
        </View>

        <ReservationStatusSelector value={reservationStatus} onChange={setReservationStatus} />

        <View style={styles.totalRow}>
          <CustomText text="Total" variant="body" style={styles.totalLabel} />
          <ReservationSheetHeroValue value={formatMoneyAmount(amount)} prefix="S/" accessibilityLabel={`Precio S/ ${formatMoneyAmount(amount)}`} />
        </View>

          </AppKeyboardAwareScrollView>
          <View style={styles.footer}>
            <ReservationSheetActionButton label="Crear reserva" onPress={handleCreate} disabled={!hasContext || !selectedCustomer} />
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
  modalHeader: {
    minHeight: 80,
    paddingHorizontal: theme.layout.screenGutter,
    paddingTop: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: theme.colors.white,
    textAlign: "center",
    textTransform: "none",
    letterSpacing: 0.2,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.72 },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenGutter,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.layout.sectionGap,
  },
  context: { gap: theme.spacing.lg },
  form: { gap: theme.spacing.sm },
  error: { color: theme.colors.error },
  totalRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  totalLabel: { color: theme.colors.textOnDarkSecondary },
  footer: { paddingHorizontal: theme.layout.screenGutter, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.md },
});
