import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import type { AnalyticsOpportunity } from "@/src/features/analytics/types/businessAnalytics";
import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const TimeRange = ({ item, featured = false }: { item: AnalyticsOpportunity; featured?: boolean }) => (
  <View style={[styles.timeGroup, featured && styles.featuredTimeGroup]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <CustomText text={item.startTime} variant="action" style={[styles.time, featured && styles.featuredTime]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} />
    <View style={styles.timeDivider} />
    <CustomText text={item.endTime} variant="action" style={[styles.time, featured && styles.featuredTime]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} />
  </View>
);

const OpportunityCopy = ({ item }: { item: AnalyticsOpportunity }) => (
  <View style={styles.copy}>
    <CustomText text={item.fieldName} variant="bodyStrong" style={styles.field} numberOfLines={1} />
    <View style={styles.metadataGroup}>
      <CustomText text={item.dateLabel} variant="caption" style={styles.metadata} numberOfLines={1} />
      <CustomText text={item.venueName} variant="caption" style={styles.venue} numberOfLines={1} />
    </View>
  </View>
);

const OpportunityCard = ({ item, featured, onPress }: { item: AnalyticsOpportunity; featured: boolean; onPress: () => void }) => {
  const label = `Ver en agenda ${item.fieldName}, ${item.dateLabel}, de ${item.startTime} a ${item.endTime}`;
  if (featured) {
    return (
      <AppSurface variant="transparent" onPress={onPress} accessibilityLabel={label} style={styles.featuredSurface}>
        <LinearGradient colors={[theme.colors.surface, theme.colors.authSurface, theme.colors.backgroundAlt]} locations={[0, 0.55, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <CustomText text={item.fieldName} variant="bodyStrong" style={styles.field} numberOfLines={1} />
            <CustomText text={item.dateLabel} variant="caption" style={styles.metadata} numberOfLines={1} />
          </View>
          <TimeRange item={item} featured />
          <CustomText text={item.venueName} variant="caption" style={styles.featuredVenue} numberOfLines={1} />
        </LinearGradient>
      </AppSurface>
    );
  }

  return (
    <AppSurface variant="transparent" onPress={onPress} accessibilityLabel={label} style={styles.card}>
      <OpportunityCopy item={item} />
      <TimeRange item={item} />
    </AppSurface>
  );
};

const AnalyticsOpportunityList = ({ items, onPress }: { items: AnalyticsOpportunity[]; onPress: (item: AnalyticsOpportunity) => void }) => {
  if (!items.length) return <CustomText text="No hay espacios libres próximos con la configuración actual." variant="body" style={styles.empty} />;
  return <View style={styles.list}>{items.map((item, index) => <OpportunityCard key={item.id} item={item} featured={index === 0} onPress={() => onPress(item)} />)}</View>;
};

export default AnalyticsOpportunityList;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
  featuredSurface: { backgroundColor: theme.colors.backgroundAlt },
  featuredCard: { minHeight: 132, alignItems: "stretch", justifyContent: "space-between", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg },
  card: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: theme.spacing.lg, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, backgroundColor: theme.colors.authSurface },
  copy: { minWidth: 0, flex: 1, gap: theme.spacing.xxs },
  featuredHeader: { minWidth: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  metadataGroup: { gap: 1 },
  field: { color: theme.colors.white },
  metadata: { color: theme.colors.textOnDarkSecondary },
  venue: { color: theme.colors.authTextSecondary },
  featuredVenue: { color: theme.colors.authTextSecondary, textAlign: "center" },
  timeGroup: { maxWidth: "48%", flexShrink: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: theme.spacing.sm },
  featuredTimeGroup: { maxWidth: "100%", alignSelf: "center", justifyContent: "center" },
  timeDivider: { width: StyleSheet.hairlineWidth, height: 18, flexShrink: 0, backgroundColor: theme.colors.dividerOnDark },
  time: { minWidth: 0, flexShrink: 1, color: theme.colors.white, fontSize: 20, lineHeight: 26, textAlign: "right" },
  featuredTime: { fontSize: 24, lineHeight: 30 },
  empty: { color: theme.colors.authTextSecondary, paddingVertical: theme.spacing.md },
});
