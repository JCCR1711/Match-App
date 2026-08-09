import CustomIcon from "@/src/components/ui/CustomIcon";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import type { BusinessMetric } from "@/src/features/analytics/types/businessAnalytics";
import { theme } from "@/src/theme";
import { Calendar03Icon, Clock01Icon, PercentCircleIcon, Ticket01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, View } from "react-native";

const iconByMetric: Record<BusinessMetric["id"], IconSvgElement> = {
  income: Ticket01Icon,
  reservations: Calendar03Icon,
  occupancy: PercentCircleIcon,
  average_ticket: Ticket01Icon,
  booked_hours: Clock01Icon,
};

const AnalyticsMetricGrid = ({ metrics }: { metrics: BusinessMetric[] }) => (
  <View style={styles.grid}>
    {metrics.map((metric, index) => {
      const featured = index === 0;
      const accent = theme.metricAccentColors[index % theme.metricAccentColors.length];
      return (
        <AppSurface key={metric.id} style={[styles.card, featured && styles.featured]}>
          <CustomIcon icon={iconByMetric[metric.id]} size={31} strokeWidth={2.4} color={featured ? theme.colors.black : accent} />
          <View style={styles.copy}>
            <CustomText text={metric.value} variant="body" style={[styles.value, featured && styles.featuredValue]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} />
            <CustomText text={metric.label} variant="caption" style={[styles.label, featured && styles.featuredLabel]} numberOfLines={1} />
          </View>
          <CustomText text={metric.change} variant="caption" style={[styles.change, { color: accent }]} />
        </AppSurface>
      );
    })}
  </View>
);

export default AnalyticsMetricGrid;

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  card: { width: "46%", minHeight: 176, flexGrow: 1, justifyContent: "space-between", padding: theme.spacing.xl },
  featured: { backgroundColor: theme.colors.white },
  copy: { gap: theme.spacing.xxs },
  value: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 30, lineHeight: 37, letterSpacing: -0.7 },
  featuredValue: { color: theme.colors.black },
  label: { color: theme.colors.authTextSecondary },
  featuredLabel: { color: theme.colors.surfaceMuted },
  change: { alignSelf: "flex-start" },
});
