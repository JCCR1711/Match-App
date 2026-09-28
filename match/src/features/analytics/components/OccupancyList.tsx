import CustomText from "@/src/components/ui/CustomText";
import type { OccupancyComparison } from "@/src/features/analytics/types/businessAnalytics";
import { getVenueImageByName } from "@/src/features/venues/data/venueImages";
import { theme } from "@/src/theme";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const reservationLabel = (count: number) => `${count} ${count === 1 ? "reserva" : "reservas"}`;

const PerformanceCard = ({ item, index }: { item: OccupancyComparison; index: number }) => {
  const content = (
    <>
      <View style={styles.thumbnail}>
        <Image source={getVenueImageByName(item.venue)} style={styles.image} contentFit="cover" transition={220} accessible={false} />
      </View>
      <View style={styles.copy}>
        <CustomText text={item.label} variant="bodyStrong" style={[styles.title, index === 0 && styles.leaderText]} numberOfLines={1} />
        <CustomText text={item.venue} variant="caption" style={[styles.metadata, index === 0 && styles.leaderMetadata]} numberOfLines={1} />
        <CustomText text={reservationLabel(item.reservations)} variant="caption" style={[styles.metadata, index === 0 && styles.leaderMetadata]} numberOfLines={1} />
      </View>
      <CustomText
        text={`${item.percentage}%`}
        variant="action"
        style={[styles.percentage, index === 0 && styles.percentageLeader]}
        adjustsFontSizeToFit
        numberOfLines={1}
      />
    </>
  );
  const accessibilityLabel = `${item.label}, ${item.venue}, ${item.percentage}% de ocupación, ${reservationLabel(item.reservations)}`;

  return <View style={[styles.card, index === 0 && styles.leaderCard]} accessible accessibilityLabel={accessibilityLabel}>{content}</View>;
};

const OccupancyList = ({ items }: { items: OccupancyComparison[] }) => {
  if (!items.length) return <CustomText text="No hay canchas con reservas confirmadas en este periodo." variant="body" style={styles.emptyText} />;
  return <View style={styles.list}>{items.map((item, index) => <PerformanceCard key={item.id} item={item} index={index} />)}</View>;
};

export default OccupancyList;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
  card: { minHeight: 84, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.xs, paddingVertical: theme.spacing.xs, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface, overflow: "hidden" },
  leaderCard: { minHeight: 88, backgroundColor: theme.colors.authPrimary },
  thumbnail: { width: 68, height: 68, flexShrink: 0, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", overflow: "hidden" },
  image: { width: "100%", height: "100%", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.surface },
  copy: { minWidth: 0, flex: 1, gap: theme.spacing.xxs },
  title: { color: theme.colors.white },
  metadata: { color: theme.colors.textOnDarkSecondary },
  leaderText: { color: theme.colors.black },
  leaderMetadata: { color: theme.colors.surfaceMuted },
  percentage: { maxWidth: 96, flexShrink: 1, color: theme.colors.white, fontSize: 24, lineHeight: 30, textAlign: "right" },
  percentageLeader: { color: theme.colors.black, fontSize: 28, lineHeight: 34 },
  emptyText: { color: theme.colors.authTextSecondary, paddingVertical: theme.spacing.md },
});
