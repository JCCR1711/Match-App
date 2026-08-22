import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import AnalyticsHeroCard from "@/src/features/analytics/components/AnalyticsHeroCard";
import AnalyticsMetricGrid from "@/src/features/analytics/components/AnalyticsMetricGrid";
import AnalyticsScopeSelector from "@/src/features/analytics/components/AnalyticsScopeSelector";
import OccupancyList from "@/src/features/analytics/components/OccupancyList";
import { getBusinessAnalyticsPreview } from "@/src/features/analytics/data/analyticsPreview";
import type { AnalyticsRange, AnalyticsScope } from "@/src/features/analytics/types/businessAnalytics";
import { router } from "expo-router";
import { useMemo, useState } from "react";

const BusinessAnalyticsView = () => {
  const [selectedRange, setSelectedRange] = useState<AnalyticsRange>("month");
  const [selectedScope, setSelectedScope] = useState<AnalyticsScope>("all");
  const snapshot = useMemo(() => getBusinessAnalyticsPreview(selectedRange, selectedScope), [selectedRange, selectedScope]);

  return (
    <AppScreenLayout title="Estadísticas" backgroundVariant="dashboard" onBack={() => router.back()}>
      <AnalyticsScopeSelector selectedScope={selectedScope} onScopeChange={setSelectedScope} />
      <AnalyticsHeroCard
        metric={snapshot.metrics[0]}
        periodLabel={snapshot.periodLabel}
        revenueTrend={snapshot.revenueTrend}
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />
      <AnalyticsMetricGrid metrics={snapshot.metrics.slice(1)} />
      <AppSection title="Ocupación por cancha">
        <OccupancyList items={snapshot.occupancy} />
      </AppSection>
    </AppScreenLayout>
  );
};

export default BusinessAnalyticsView;
