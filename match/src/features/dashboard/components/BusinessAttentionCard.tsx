import CustomText from "@/src/components/ui/CustomText";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { Pressable, StyleSheet, View } from "react-native";

const BusinessAttentionCard = ({ reservation, count, onPress }: { reservation: ReservationRecord; count: number; onPress: () => void }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={`${count} reservas por confirmar`} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={styles.indicator} />
    <View style={styles.copy}>
      <CustomText text={`${count} ${count === 1 ? "reserva" : "reservas"} por confirmar`} variant="sectionHeading" style={styles.title} />
      <CustomText text={`${reservation.startTime} · ${reservation.customerName} · ${reservation.fieldName}`} variant="caption" style={styles.detail} numberOfLines={1} />
    </View>
    <CustomText text="Revisar" variant="caption" style={styles.action} />
  </Pressable>
);

export default BusinessAttentionCard;

const styles = StyleSheet.create({
  card: { minHeight: 124, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.lg, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.accent },
  indicator: { width: 8, alignSelf: "stretch", borderRadius: theme.radius.pill, backgroundColor: theme.colors.black },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  title: { color: theme.colors.black },
  detail: { color: theme.colors.black },
  action: { color: theme.colors.black, fontFamily: theme.fontFamilies.poppinsBold },
  pressed: { opacity: 0.78 },
});
