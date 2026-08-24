import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import CustomText from "@/src/components/ui/CustomText";
import BusinessReservationPreviewCard from "@/src/features/reservations/components/BusinessReservationPreviewCard";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { createFocusedReservationAgendaHref } from "@/src/features/reservations/utils/businessAgendaRoute";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const getRouteParam = (param: string | string[] | undefined) => Array.isArray(param) ? param[0] : param;

const BusinessPendingReservationsView = () => {
  const params = useLocalSearchParams<{ dateKey?: string | string[] }>();
  const dateKey = getRouteParam(params.dateKey) ?? reservationDates[0].dateKey;
  const { reservations } = useReservations();
  const pendingReservations = useMemo(
    () => reservations
      .filter((reservation) => reservation.dateKey === dateKey && reservation.status === "pending")
      .sort((first, second) => first.startTime.localeCompare(second.startTime)),
    [dateKey, reservations],
  );

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
          data={pendingReservations}
          keyExtractor={(reservation) => reservation.id}
          renderItem={({ item }) => <BusinessReservationPreviewCard reservation={item} onPress={() => openInAgenda(item)} />}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={<CustomText text={`${pendingReservations.length} ${pendingReservations.length === 1 ? "reserva por revisar" : "reservas por revisar"}`} variant="body" style={styles.summary} />}
          ListEmptyComponent={<CustomText text="No hay reservas pendientes para hoy" variant="body" style={styles.empty} />}
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
  empty: { marginVertical: "auto", color: theme.colors.authTextSecondary, textAlign: "center" },
});
