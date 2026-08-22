import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import FinanceMetricGrid from "@/src/features/payments/components/FinanceMetricGrid";
import FinanceSummaryCard from "@/src/features/payments/components/FinanceSummaryCard";
import MovementList from "@/src/features/payments/components/MovementList";
import SettlementSummaryLink from "@/src/features/payments/components/SettlementSummaryLink";
import { financialMovements } from "@/src/features/payments/data/paymentsPreview";
import { router } from "expo-router";

const BusinessPaymentsView = () => (
  <AppScreenLayout
    title="Pagos"
    backgroundVariant="dashboard"
    onBack={() => router.back()}
  >
    <FinanceSummaryCard />
    <FinanceMetricGrid />
    <AppSection title="Liquidaciones">
      <SettlementSummaryLink onPress={() => router.push("/business/settlements")} />
    </AppSection>
    <AppSection title="Movimientos">
      <MovementList movements={financialMovements} />
    </AppSection>
  </AppScreenLayout>
);

export default BusinessPaymentsView;
