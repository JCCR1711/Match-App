import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import CustomText from "@/src/components/ui/CustomText";
import FinanceMetricGrid from "@/src/features/payments/components/FinanceMetricGrid";
import FinanceSummaryCard from "@/src/features/payments/components/FinanceSummaryCard";
import MovementList from "@/src/features/payments/components/MovementList";
import SettlementOverviewLink from "@/src/features/payments/components/SettlementOverviewLink";
import { financialMovements, paymentOverview, settlements } from "@/src/features/payments/data/paymentsPreview";
import { getPendingSettlementAmount, getPendingSettlements } from "@/src/features/payments/utils/settlementSelectors";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { createFocusedReservationAgendaHref } from "@/src/features/reservations/utils/businessAgendaRoute";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { backOrReplace } from "@/src/utils/routerNavigation";

const BusinessPaymentsView = () => {
  const { reservations } = useReservations();
  const pendingSettlements = getPendingSettlements(settlements);
  const pendingAmount = getPendingSettlementAmount(pendingSettlements);

  return (
  <AppScreenLayout
    title="Pagos"
    headerTitleMode="scroll"
    backgroundVariant="dashboard"
    onBack={() => backOrReplace("/(tabs)/dashboard")}
  >
    <FinanceSummaryCard overview={paymentOverview} />
    <FinanceMetricGrid overview={paymentOverview} />
    <AppSection title="Liquidaciones">
      {pendingSettlements.length > 0 ? (
        <SettlementOverviewLink pendingAmount={pendingAmount} pendingCount={pendingSettlements.length} onPress={() => router.push("/business/settlements")} />
      ) : (
        <CustomText text="No hay liquidaciones en proceso" variant="body" style={styles.empty} />
      )}
    </AppSection>
    <AppSection title="Movimientos">
      <MovementList
        movements={financialMovements}
        onPressMovement={(movement) => {
          const reservation = reservations.find((item) => item.id === movement.reservationId);
          if (reservation) router.navigate(createFocusedReservationAgendaHref(reservation));
        }}
      />
    </AppSection>
  </AppScreenLayout>
  );
};

export default BusinessPaymentsView;

const styles = StyleSheet.create({
  empty: { color: theme.colors.authTextSecondary },
});
