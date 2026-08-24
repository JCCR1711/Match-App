import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import AppSection from "@/src/components/ui/AppSection";
import AppTimeRange from "@/src/components/ui/AppTimeRange";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import ResourceActionsMenu from "@/src/features/venues/components/ResourceActionsMenu";
import ResourceDeleteConfirmSheet from "@/src/features/venues/components/ResourceDeleteConfirmSheet";
import ResourceStatusLabel from "@/src/features/venues/components/ResourceStatusLabel";
import FieldTodayOverview from "@/src/features/venues/components/FieldTodayOverview";
import WeekdaySelector from "@/src/features/venues/components/WeekdaySelector";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { hasFieldScheduleDependencies } from "@/src/features/reservations/utils/hasFieldScheduleDependencies";
import { createBusinessAgendaHref, createFocusedReservationAgendaHref } from "@/src/features/reservations/utils/businessAgendaRoute";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { ResourceStatus, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const getFieldFormatLabel = (format: string) => `Fútbol ${format.split("v")[0]}`;

const FieldDetailView = () => {
  const { fieldId } = useLocalSearchParams<{ fieldId: string }>();
  const { accessToken } = useAuth();
  const { reservations, blocks } = useReservations();
  const { draft, loading, error, reload } = useBusinessDraft();
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const field = draft?.fields.find((item) => item.fieldId === fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);
  const schedule = field ? getEffectiveFieldSchedule(field, venue) : null;
  const todayReservations = field ? reservations.filter(isActiveReservation).filter((reservation) => reservation.fieldId === field.fieldId && reservation.dateKey === reservationDates[0].dateKey) : [];
  const todayBlocks = field ? blocks.filter((block) => block.fieldId === field.fieldId && block.dateKey === reservationDates[0].dateKey) : [];

  const updateStatus = async (status: ResourceStatus) => {
    if (!accessToken || !draft || !field) return;
    setMenuVisible(false);
    setBusy(true);
    setActionError(null);
    try {
      await venueOnboardingGateway.updateFieldStatus(accessToken, draft.organizationId, field.fieldId, status);
      reload();
    } catch (statusError) {
      setActionError(statusError instanceof Error ? statusError.message : "No pudimos actualizar la cancha.");
    } finally {
      setBusy(false);
    }
  };

  const deleteField = async () => {
    if (!accessToken || !draft || !field) return;
    setBusy(true);
    try {
      await venueOnboardingGateway.deleteSportsField(accessToken, draft.organizationId, field.fieldId);
      router.back();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "No pudimos eliminar la cancha.");
      setBusy(false);
    }
  };

  const confirmDelete = () => {
    if (!field) return;
    setMenuVisible(false);
    if (hasFieldScheduleDependencies([field.fieldId], reservations, blocks)) {
      setActionError("No puedes eliminar una cancha con reservas o bloqueos activos.");
      return;
    }
    setActionError(null);
    setDeleteVisible(true);
  };

  return (
    <AppScreenFrame
      title="Detalles"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      onBack={() => router.back()}
      backAccessibilityLabel="Cerrar detalles de cancha"
      backIconVariant="dismiss"
      headerAction={field ? <CustomButton icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.white} size={26} strokeWidth={3} />} size="icon" variant="inverse" onPress={() => setMenuVisible(true)} style={styles.headerMenu} accessibilityLabel="Opciones de cancha" /> : null}
    >
      {({ onScroll, contentBottomInset }) => (
        <>
          <Animated.ScrollView contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]} showsVerticalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
            {!field ? <CustomText text={loading ? "Cargando" : error ?? "No encontramos esta cancha"} variant="body" style={styles.empty} accessibilityRole={error ? "alert" : undefined} /> : (
              <>
                <View style={styles.media}>
                  <Image source={getVenueImage(field.venueId)} style={StyleSheet.absoluteFill} contentFit="cover" transition={180} cachePolicy="memory-disk" />
                  <LinearGradient
                    pointerEvents="none"
                    colors={[`${theme.colors.black}B8`, `${theme.colors.black}00`]}
                    locations={[0, 1]}
                    style={styles.mediaShade}
                  />
                </View>

                <LinearGradient
                  colors={[theme.colors.surface, theme.colors.backgroundAlt, theme.colors.appCanvas]}
                  locations={[0, 0.42, 1]}
                  start={{ x: 0.08, y: 0 }}
                  end={{ x: 0.9, y: 1 }}
                  style={styles.body}
                >
                  <View style={styles.identity}>
                    <View style={styles.identityCopy}>
                      <CustomText text={field.fieldName} variant="subtitle" style={styles.fieldName} numberOfLines={2} />
                      <CustomText text={venue ? `${venue.venueName} · ${venue.district}` : "Sede"} variant="body" style={styles.venueName} numberOfLines={1} />
                    </View>
                    <ResourceStatusLabel status={field.status} />
                  </View>

                  <FieldTodayOverview
                    reservations={todayReservations}
                    blocks={todayBlocks}
                    onOpenAgenda={() => router.push(createBusinessAgendaHref({ fieldId: field.fieldId, dateKey: reservationDates[0].dateKey }))}
                    onOpenReservation={(reservation) => router.push(createFocusedReservationAgendaHref(reservation))}
                  />

                  <AppSection title="Disponibilidad" actionLabel="Editar" onAction={() => router.push({ pathname: "/business/fields/[fieldId]/availability", params: { fieldId: field.fieldId } })}>
                    <ScheduleSection schedule={schedule} />
                  </AppSection>

                  <AppSection title="Tarifas y modalidad">
                    <View style={styles.pricing} accessible accessibilityLabel={`Modalidad ${getFieldFormatLabel(field.format)}. Tarifa regular S/ ${formatMoneyAmount(field.hourlyPrice)}`}>
                      <View style={styles.priceGrid}>
                        <View style={styles.primaryRate}>
                          <CustomText text="Día" variant="caption" style={styles.dayRateHint} />
                          <MoneyValue amount={field.hourlyPrice} inverted />
                        </View>
                        {field.nightHourlyPrice ? (
                          <View style={styles.nightRate}>
                            <CustomText text="Noche" variant="caption" style={styles.rateHint} />
                            <MoneyValue amount={field.nightHourlyPrice} />
                            <CustomText text={`Desde ${field.nightStartsAt ?? "18:00"}`} variant="label" style={styles.rateTime} />
                          </View>
                        ) : null}
                      </View>
                      <View style={styles.modality}>
                        <CustomText text={getFieldFormatLabel(field.format)} variant="bodyStrong" style={styles.format} />
                      </View>
                    </View>
                  </AppSection>
                  {error || actionError ? <CustomText text={error ?? actionError ?? ""} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
                </LinearGradient>
              </>
            )}
          </Animated.ScrollView>
          <ResourceActionsMenu
            visible={menuVisible}
            title={field?.fieldName ?? "Cancha"}
            active={field?.status === "active"}
            disabled={busy}
            onClose={() => setMenuVisible(false)}
            secondaryAction={{
              label: "Editar datos",
              onPress: () => {
                setMenuVisible(false);
                if (field) router.push({ pathname: "/business/fields/[fieldId]/edit", params: { fieldId: field.fieldId } });
              },
            }}
            onToggleStatus={() => field && void updateStatus(field.status === "active" ? "inactive" : "active")}
            onDelete={confirmDelete}
          />
          <ResourceDeleteConfirmSheet
            visible={deleteVisible}
            resourceName={field?.fieldName ?? "Cancha"}
            detail="Se eliminará su configuración. Esta acción no se puede deshacer."
            disabled={busy}
            onClose={() => setDeleteVisible(false)}
            onConfirm={() => {
              setDeleteVisible(false);
              void deleteField();
            }}
          />
        </>
      )}
    </AppScreenFrame>
  );
};

const ScheduleSection = ({ schedule }: { schedule: WeeklySchedule | null }) => (
  <View style={styles.schedule}>
    {schedule ? <><AppTimeRange startTime={schedule.openingTime} endTime={schedule.closingTime} tone="neutral" /><WeekdaySelector value={schedule.weekdays} readOnly /></> : <CustomText text="Sin horario configurado" variant="body" style={styles.muted} />}
  </View>
);

const MoneyValue = ({ amount, inverted = false }: { amount: number; inverted?: boolean }) => (
  <View style={styles.moneyValue}>
    <CustomText text="S/" variant="caption" style={[styles.moneyCurrency, inverted && styles.moneyCurrencyInverted]} />
    <CustomText text={formatMoneyAmount(amount)} variant="subtitle" style={[styles.moneyAmount, inverted && styles.moneyAmountInverted]} />
  </View>
);

export default FieldDetailView;

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg },
  headerMenu: { width: 44, height: 44, minHeight: 44, borderWidth: 0, backgroundColor: "transparent" },
  media: { aspectRatio: 3 / 2, marginHorizontal: -theme.spacing.lg, overflow: "hidden", backgroundColor: theme.colors.authSurface },
  mediaShade: { position: "absolute", top: 0, right: 0, left: 0, height: 132 },
  body: { marginTop: -theme.spacing.xxl, marginHorizontal: -theme.spacing.lg, gap: theme.layout.sectionGap, paddingTop: theme.spacing.xxl, paddingHorizontal: theme.spacing.lg, borderTopLeftRadius: theme.radius.sheet, borderTopRightRadius: theme.radius.sheet, borderCurve: "continuous" },
  identity: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: theme.spacing.lg }, identityCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  fieldName: { color: theme.colors.white }, venueName: { color: theme.colors.textOnDarkSecondary },
  schedule: { gap: theme.spacing.xl, paddingVertical: theme.spacing.sm },
  pricing: { gap: theme.spacing.lg }, priceGrid: { flexDirection: "row", gap: theme.spacing.md }, primaryRate: { flex: 1, minWidth: 0, minHeight: 118, justifyContent: "space-between", gap: theme.spacing.md, padding: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.authPrimary }, nightRate: { flex: 1, minWidth: 0, minHeight: 118, justifyContent: "space-between", gap: theme.spacing.xs, padding: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.authSurface }, modality: { minHeight: 40, justifyContent: "center" }, format: { color: theme.colors.white }, dayRateHint: { color: theme.colors.black }, rateHint: { color: theme.colors.white }, rateTime: { color: theme.colors.textOnDarkSecondary }, moneyValue: { flexShrink: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs }, moneyCurrency: { color: theme.colors.textOnDarkSecondary }, moneyCurrencyInverted: { color: theme.colors.black, opacity: 0.66 }, moneyAmount: { color: theme.colors.white }, moneyAmountInverted: { color: theme.colors.black },
  muted: { color: theme.colors.authTextSecondary }, error: { color: theme.colors.errorSoft }, empty: { minHeight: 360, color: theme.colors.authTextSecondary, textAlign: "center", textAlignVertical: "center" },
});
