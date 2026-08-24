import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import FinanceMetricGrid from "@/src/features/payments/components/FinanceMetricGrid";
import FinanceSummaryCard from "@/src/features/payments/components/FinanceSummaryCard";
import MovementList from "@/src/features/payments/components/MovementList";
import SettlementSummaryLink from "@/src/features/payments/components/SettlementSummaryLink";
import { financialMovements, paymentOverview, settlements } from "@/src/features/payments/data/paymentsPreview";
import { router } from "expo-router";

const BusinessPaymentsView = () => (
  <AppScreenLayout
    title="Pagos"
    headerTitleMode="scroll"
    backgroundVariant="dashboard"
    onBack={() => router.back()}
  >
    <FinanceSummaryCard overview={paymentOverview} />
    <FinanceMetricGrid overview={paymentOverview} />
    <AppSection title="Liquidaciones">
      <SettlementSummaryLink settlement={settlements[0]} onPress={() => router.push("/business/settlements")} />
    </AppSection>
    <AppSection title="Movimientos">
      <MovementList movements={financialMovements} />
    </AppSection>
  </AppScreenLayout>
);

export default BusinessPaymentsView;
