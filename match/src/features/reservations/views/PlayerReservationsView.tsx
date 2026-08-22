import AppBackground from "@/src/components/ui/AppBackground";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import CustomText from "@/src/components/ui/CustomText";
import PlayerReservationCard from "@/src/features/reservations/components/PlayerReservationCard";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PlayerReservationsView = () => {
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const { reservations, isHydrated } = useReservations();
  const upcomingReservations = reservations.filter(
    (reservation) => reservation.status !== "canceled" && reservation.dateKey >= reservationDates[0].dateKey,
  );
  const renderReservation = useCallback(
    ({ item }: { item: (typeof reservations)[number] }) => <PlayerReservationCard reservation={{ id: item.id, venueName: item.venueName, fieldName: item.fieldName, dateLabel: item.dateLabel, startTime: item.startTime, durationMinutes: item.durationMinutes, total: item.amount, status: item.status === "pending" ? "pending" : "confirmed" }} />,
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
          ListHeaderComponent={<CustomText text="Próximas" variant="sectionHeading" style={styles.title} />}
          ListEmptyComponent={
            <CustomText
              text={isHydrated ? "Todavía no tienes reservas próximas." : "Cargando reservas..."}
              variant="body"
              style={styles.emptyState}
            />
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
  emptyState: { paddingTop: theme.spacing.xl, color: theme.colors.authTextSecondary, textAlign: "center" },
});
