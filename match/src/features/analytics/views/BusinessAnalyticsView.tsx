import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import AnalyticsHeroCard from "@/src/features/analytics/components/AnalyticsHeroCard";
import AnalyticsMetricGrid from "@/src/features/analytics/components/AnalyticsMetricGrid";
import OccupancyList from "@/src/features/analytics/components/OccupancyList";
import { businessMetrics, occupancyComparison } from "@/src/features/analytics/data/analyticsPreview";
import DashboardBackground from "@/src/features/dashboard/components/DashboardBackground";
import DashboardSection from "@/src/features/dashboard/components/DashboardSection";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessAnalyticsView = () => {
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <DashboardBackground />
      <AppScreenHeader title="Estadísticas" onBack={() => router.back()} scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.ScrollView
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.lg }]}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <AnalyticsHeroCard metric={businessMetrics[0]} />
          <AnalyticsMetricGrid metrics={businessMetrics.slice(1)} />
          <DashboardSection title="Ocupación por cancha">
            <OccupancyList items={occupancyComparison} />
          </DashboardSection>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BusinessAnalyticsView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge, gap: theme.spacing.xxxl },
});
