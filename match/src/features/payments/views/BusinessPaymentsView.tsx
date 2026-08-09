import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import DashboardBackground from "@/src/features/dashboard/components/DashboardBackground";
import DashboardSection from "@/src/features/dashboard/components/DashboardSection";
import FinanceSummaryCard from "@/src/features/payments/components/FinanceSummaryCard";
import FinanceMetricGrid from "@/src/features/payments/components/FinanceMetricGrid";
import MovementList from "@/src/features/payments/components/MovementList";
import { financialMovements } from "@/src/features/payments/data/paymentsPreview";
import DashboardStatusCard from "@/src/features/dashboard/components/DashboardStatusCard";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { BankIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessPaymentsView = () => {
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <DashboardBackground />
      <AppScreenHeader title="Pagos" onBack={() => router.back()} scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.ScrollView contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.lg }]} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          <FinanceSummaryCard />
          <FinanceMetricGrid />
          <DashboardSection title="Liquidaciones">
            <DashboardStatusCard icon={BankIcon} title="Próxima liquidación" value="S/ 1,840" onPress={() => router.push("/business/settlements")} accessibilityLabel="Ver liquidaciones" />
          </DashboardSection>
          <DashboardSection title="Movimientos">
            <MovementList movements={financialMovements} />
          </DashboardSection>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BusinessPaymentsView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge, gap: theme.spacing.xxl },
});
