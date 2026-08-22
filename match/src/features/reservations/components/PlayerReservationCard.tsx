import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import { formatBookingDuration } from "@/src/features/reservations/utils/formatBookingDuration";
import { getVenueImageByName } from "@/src/features/venues/data/venueImages";
import { theme } from "@/src/theme";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface PlayerReservationCardRecord {
  id: string;
  venueName: string;
  fieldName: string;
  dateLabel: string;
  startTime: string;
  durationMinutes: number;
  status: "confirmed" | "pending";
  total: number;
}

const PlayerReservationCard = ({ reservation }: { reservation: PlayerReservationCardRecord }) => {
  return (
    <AppSurface style={styles.card} accessibilityLabel={`${reservation.venueName}, ${reservation.dateLabel}`}>
      <Image source={getVenueImageByName(reservation.venueName)} style={styles.image} contentFit="cover" transition={180} />
      <View style={styles.copy}>
        <View style={styles.heading}>
          <CustomText text={reservation.venueName} variant="action" style={styles.venueName} numberOfLines={1} />
          <ScheduleStatusLabel status={reservation.status} />
        </View>
        <CustomText text={`${reservation.dateLabel} · ${reservation.startTime}`} variant="caption" style={styles.date} numberOfLines={1} />
        <CustomText text={`${reservation.fieldName} · ${formatBookingDuration(reservation.durationMinutes)}`} variant="caption" style={styles.meta} numberOfLines={1} />
      </View>
      <CustomText text={`S/ ${reservation.total}`} variant="actionSecondary" style={styles.total} />
    </AppSurface>
  );
};

export default PlayerReservationCard;

const styles = StyleSheet.create({
  card: { minHeight: 108, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.sm, borderRadius: theme.radius.large },
  image: { width: 84, height: 84, borderRadius: theme.radius.standard, backgroundColor: theme.colors.authSurface },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  heading: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  venueName: { flex: 1, color: theme.colors.white },
  date: { color: theme.colors.white },
  meta: { color: theme.colors.authTextSecondary },
  total: { alignSelf: "flex-end", color: theme.colors.accent, paddingBottom: theme.spacing.xs, paddingRight: theme.spacing.xs, textAlign: "right" },
});
