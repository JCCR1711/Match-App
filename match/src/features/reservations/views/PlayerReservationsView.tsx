import AppBackground from "@/src/components/ui/AppBackground";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import AppScreenState from "@/src/components/ui/AppScreenState";
import CustomText from "@/src/components/ui/CustomText";
import PlayerReservationCard from "@/src/features/reservations/components/PlayerReservationCard";
import PlayerReservationListSkeleton from "@/src/features/reservations/components/PlayerReservationListSkeleton";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { isActiveReservation, type ActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PlayerReservationsView = () => {
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const { user } = useAuth();
  const { reservations, isHydrated } = useReservations();
  const upcomingReservations = reservations
    .filter(isActiveReservation)
    .filter(
      (reservation) =>
        reservation.customerId === user?.id &&
        reservation.dateKey >= reservationDates[0].dateKey,
    );
  const renderReservation = useCallback(
    ({ item }: { item: ActiveReservation }) => <PlayerReservationCard reservation={item} />,
    [],
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground />
      <AppScreenHeader title="Mis reservas" scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.FlatList
          data={isHydrated ? upcomingReservations : []}
          keyExtractor={(reservation) => reservation.id}
          renderItem={renderReservation}
          ListHeaderComponent={upcomingReservations.length > 0 ? <CustomText text="Próximas" variant="sectionHeading" style={styles.title} /> : null}
          ListEmptyComponent={
            isHydrated ? (
              <AppScreenState
                kind="empty"
                title="Aún no tienes reservas"
                message="Explora canchas cercanas y elige el horario que prefieras."
                actionLabel="Explorar canchas"
                onAction={() => router.navigate("/(tabs)")}
                style={styles.screenState}
              />
            ) : <PlayerReservationListSkeleton />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.xl }]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </SafeAreaView>
    </View>
  );
};

export default PlayerReservationsView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge * 2 + theme.spacing.lg },
  title: { color: theme.colors.white },
  separator: { height: theme.spacing.sm },
  screenState: { minHeight: 480, marginHorizontal: -theme.spacing.lg },
});
