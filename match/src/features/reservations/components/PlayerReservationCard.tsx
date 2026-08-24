import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { ReservationCreateStatus } from "@/src/features/reservations/types/reservation";
import { getCompactFieldName } from "@/src/features/reservations/utils/reservationIdentity";
import { formatTimeRange } from "@/src/features/reservations/utils/reservationTime";
import { getVenueImageByName } from "@/src/features/venues/data/venueImages";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface PlayerReservationCardRecord {
  id: string;
  venueName: string;
  fieldName: string;
  dateLabel: string;
  startTime: string;
  durationMinutes: number;
  status: ReservationCreateStatus;
  amount: number;
}

const PlayerReservationCard = ({ reservation }: { reservation: PlayerReservationCardRecord }) => {
  return (
    <AppSurface style={styles.card} accessibilityLabel={`${reservation.venueName}, ${reservation.dateLabel}`}>
      <Image source={getVenueImageByName(reservation.venueName)} style={styles.image} contentFit="cover" transition={180} />
      <View style={styles.copy}>
        <View style={styles.heading}>
          <CustomText text={reservation.venueName} variant="action" style={styles.venueName} numberOfLines={1} ellipsizeMode="tail" />
          <ScheduleStatusLabel status={reservation.status} />
        </View>
        <CustomText text={`${reservation.dateLabel} · ${formatTimeRange(reservation.startTime, reservation.durationMinutes)}`} variant="caption" style={styles.date} numberOfLines={1} ellipsizeMode="tail" />
        <CustomText text={getCompactFieldName(reservation.fieldName)} variant="caption" style={styles.meta} numberOfLines={1} ellipsizeMode="tail" />
      </View>
      <CustomText text={formatSoles(reservation.amount)} variant="actionSecondary" style={styles.total} numberOfLines={1} />
    </AppSurface>
  );
};

export default PlayerReservationCard;

const styles = StyleSheet.create({
  card: { minHeight: 108, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.sm, borderRadius: theme.radius.large },
  image: { width: 84, height: 84, borderRadius: theme.radius.standard, backgroundColor: theme.colors.authSurface },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  heading: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  venueName: { flex: 1, minWidth: 0, color: theme.colors.white },
  date: { color: theme.colors.white },
  meta: { color: theme.colors.authTextSecondary },
  total: { flexShrink: 0, alignSelf: "flex-end", color: theme.colors.accent, paddingBottom: theme.spacing.xs, paddingRight: theme.spacing.xs, textAlign: "right" },
});
