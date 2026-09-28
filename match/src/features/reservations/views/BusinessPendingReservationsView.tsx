import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import AppScreenState from "@/src/components/ui/AppScreenState";
import CustomText from "@/src/components/ui/CustomText";
import BusinessReservationPreviewCard from "@/src/features/reservations/components/BusinessReservationPreviewCard";
import BusinessReservationListSkeleton from "@/src/features/reservations/components/BusinessReservationListSkeleton";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { createFocusedReservationAgendaHref } from "@/src/features/reservations/utils/businessAgendaRoute";
import { getBusinessReservations } from "@/src/features/reservations/utils/getBusinessReservations";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const getRouteParam = (param: string | string[] | undefined) => Array.isArray(param) ? param[0] : param;

const BusinessPendingReservationsView = () => {
  const params = useLocalSearchParams<{ dateKey?: string | string[] }>();
  const dateKey = getRouteParam(params.dateKey) ?? reservationDates[0].dateKey;
  const {
    draft,
    loading: draftLoading,
    error: draftError,
    reload: reloadDraft,
  } = useBusinessDraft({ redirectWhenMissing: false });
  const {
    reservations,
    loading: reservationsLoading,
    error: reservationsError,
    reload: reloadReservations,
  } = useReservations(draft?.organizationId);
  const [retrying, setRetrying] = useState(false);
  const [retainedLoadError, setRetainedLoadError] = useState<string | null>(null);
  const loading = reservationsLoading || draftLoading;
  const loadError = reservationsError ?? draftError ?? retainedLoadError;
  const pendingReservations = useMemo(
    () => getBusinessReservations(reservations, draft?.fields ?? [])
      .filter((reservation) => reservation.dateKey === dateKey && reservation.status === "pending")
      .sort((first, second) => first.startTime.localeCompare(second.startTime)),
    [dateKey, draft?.fields, reservations],
  );

  const retryPendingReservations = async () => {
    if (retrying) return;
    setRetainedLoadError(reservationsError ?? draftError);
    setRetrying(true);
    await Promise.allSettled([reloadDraft(), reloadReservations()]);
    setRetrying(false);
    setRetainedLoadError(null);
  };

  const openInAgenda = (reservation: ReservationRecord) => {
    router.navigate(createFocusedReservationAgendaHref(reservation));
  };

  return (
    <AppScreenFrame
      title="Pendientes"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="dashboard"
      onBack={() => router.back()}
      backAccessibilityLabel="Volver al inicio"
    >
      {({ onScroll, headerContentInset, contentBottomInset }) => (
        <Animated.FlatList
          data={loading || loadError ? [] : pendingReservations}
          keyExtractor={(reservation) => reservation.id}
          renderItem={({ item }) => <BusinessReservationPreviewCard reservation={item} onPress={() => openInAgenda(item)} />}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={pendingReservations.length > 0 && !loading && !loadError ? <CustomText text={`${pendingReservations.length} ${pendingReservations.length === 1 ? "reserva por revisar" : "reservas por revisar"}`} variant="body" style={styles.summary} /> : null}
          ListEmptyComponent={
            loading ? (
              <BusinessReservationListSkeleton />
            ) : loadError ? (
              <AppScreenState
                kind="error"
                title="No pudimos cargar las pendientes"
                message={loadError}
                actionLabel={retrying ? "Reintentando..." : "Intentar de nuevo"}
                actionLoading={retrying}
                onAction={() => void retryPendingReservations()}
                style={styles.screenState}
              />
            ) : (
              <AppScreenState kind="empty" title="Todo está al día" message="No hay reservas pendientes para hoy." style={styles.screenState} />
            )
          }
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.xl, paddingBottom: contentBottomInset }]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      )}
    </AppScreenFrame>
  );
};

const Separator = () => <View style={styles.separator} />;

export default BusinessPendingReservationsView;

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: theme.layout.screenGutter },
  summary: { marginBottom: theme.spacing.lg, color: theme.colors.textOnDarkSecondary },
  separator: { height: theme.spacing.sm },
  screenState: { minHeight: 480, marginHorizontal: -theme.layout.screenGutter },
});
