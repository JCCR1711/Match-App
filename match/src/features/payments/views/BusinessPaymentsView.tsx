import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import AppContextHelp from "@/src/components/ui/AppContextHelp";
import CustomText from "@/src/components/ui/CustomText";
import FinanceMetricGrid from "@/src/features/payments/components/FinanceMetricGrid";
import FinanceSummaryCard from "@/src/features/payments/components/FinanceSummaryCard";
import FinanceAccessNotice from "@/src/features/payments/components/FinanceAccessNotice";
import MovementList from "@/src/features/payments/components/MovementList";
import PayoutAccountLink from "@/src/features/payments/components/PayoutAccountLink";
import SettlementOverviewLink from "@/src/features/payments/components/SettlementOverviewLink";
import { financialMovements, paymentOverview, settlements } from "@/src/features/payments/data/paymentsPreview";
import { getPendingSettlementAmount, getPendingSettlements } from "@/src/features/payments/utils/settlementSelectors";
import { getBusinessFinanceAccess } from "@/src/features/payments/utils/businessFinanceAccess";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import { usePayoutAccount } from "@/src/features/payments/hooks/usePayoutAccount";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { createFocusedReservationAgendaHref } from "@/src/features/reservations/utils/businessAgendaRoute";
import { getBusinessReservations } from "@/src/features/reservations/utils/getBusinessReservations";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

const BusinessPaymentsView = () => {
  const { draft, loading } = useBusinessDraft();
  const { reservations } = useReservations(draft?.organizationId);
  const { effectiveMembership, effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const businessReservations = getBusinessReservations(reservations, draft?.fields ?? []);
  const financeAccess = getBusinessFinanceAccess(effectiveRole);
  const { account: payoutAccount } = usePayoutAccount(draft?.organizationId);
  const pendingSettlements = getPendingSettlements(settlements);
  const pendingAmount = getPendingSettlementAmount(pendingSettlements);
  const nextSettlement = pendingSettlements[0] ?? null;

  return (
    <AppScreenLayout
      title="Finanzas"
      headerTitleMode="scroll"
      backgroundVariant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "dashboard"}
      onBack={() => backOrReplace("/(tabs)/dashboard")}
      contentStyle={styles.content}
    >
      {!loading && !planLoading && !effectiveMembership.enabled ? <BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} allowBack /> : null}
      {!loading && !planLoading && effectiveMembership.enabled && !financeAccess.canViewFinances ? <FinanceAccessNotice /> : null}
      {financeAccess.canViewFinances ? (
        <>
          <FinanceSummaryCard overview={paymentOverview} />
          <FinanceMetricGrid overview={paymentOverview} />
          <AppSection title="Cuenta de depósito">
            <PayoutAccountLink account={payoutAccount} onPress={() => router.push("/business/payout-account")} />
          </AppSection>
          <AppSection
            title="Liquidaciones"
            titleAccessory={
              <AppContextHelp
                title="Liquidaciones"
                description="Agrupaciones del dinero cobrado que Match prepara para depositarlo en tu cuenta bancaria."
              />
            }
          >
            {pendingSettlements.length > 0 ? (
              <SettlementOverviewLink
                pendingAmount={pendingAmount}
                pendingCount={pendingSettlements.length}
                expectedDepositLabel={nextSettlement?.expectedDepositLabel ?? "Por confirmar"}
                onPress={() => router.push("/business/settlements")}
              />
            ) : (
              <CustomText text="No hay liquidaciones en proceso" variant="body" style={styles.empty} />
            )}
          </AppSection>
          <AppSection title="Movimientos">
            <MovementList
              movements={financialMovements}
              onPressMovement={(movement) => {
                const reservation = businessReservations.find((item) => item.id === movement.reservationId);
                if (reservation) router.navigate(createFocusedReservationAgendaHref(reservation));
              }}
            />
          </AppSection>
        </>
      ) : null}
    </AppScreenLayout>
  );
};

export default BusinessPaymentsView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.groupGap },
  empty: { color: theme.colors.authTextSecondary },
});
