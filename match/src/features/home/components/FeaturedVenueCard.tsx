import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import type { PublicVenue } from "@/src/features/venues/types/publicVenue";
import { theme } from "@/src/theme";
import { ArrowRight01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

interface FeaturedVenueCardProps {
  venue: PublicVenue;
  times: readonly string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  onOpen: () => void;
}

const FeaturedVenueCard = ({ venue, times, selectedTime, onSelectTime, onOpen }: FeaturedVenueCardProps) => (
  <View style={styles.container}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Ver ${venue.name}`} onPress={onOpen} style={({ pressed }) => [styles.media, pressed && styles.pressed]}>
      <Image source={getVenueImage(venue.id)} style={StyleSheet.absoluteFill} contentFit="cover" transition={220} accessibilityLabel={`Cancha iluminada de ${venue.name}`} />
    </Pressable>

    <View style={styles.copy}>
      <CustomText text={venue.name} variant="sectionHeading" style={styles.title} numberOfLines={1} />
      <View style={styles.location}>
        <CustomIcon icon={Location01Icon} color={theme.colors.authTextSecondary} size={16} />
        <CustomText text={`${venue.district} · ${venue.distanceLabel}`} variant="caption" style={styles.metadata} numberOfLines={1} />
      </View>
    </View>

    <View style={styles.times} accessibilityRole="tablist">
      {times.map((time) => {
        const selected = selectedTime === time;
        return (
          <Pressable key={time} accessibilityRole="tab" accessibilityLabel={`Horario ${time}`} accessibilityState={{ selected }} onPress={() => onSelectTime(time)} style={({ pressed }) => [styles.time, selected && styles.timeSelected, pressed && styles.pressed]}>
            <CustomText text={time} variant="actionSecondary" style={[styles.timeText, selected && styles.timeTextSelected]} />
          </Pressable>
        );
      })}
    </View>

    <Pressable accessibilityRole="button" accessibilityLabel={`Reservar ${venue.name} a las ${selectedTime} por 90 soles`} onPress={onOpen} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <View>
        <CustomText text={`Reservar a las ${selectedTime}`} variant="action" style={styles.actionTitle} />
        <CustomText text="S/ 90 por hora" variant="caption" style={styles.actionMeta} />
      </View>
      <View style={styles.actionIcon}>
        <CustomIcon icon={ArrowRight01Icon} color={theme.colors.white} size={21} />
      </View>
    </Pressable>
  </View>
);

export default FeaturedVenueCard;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.md },
  media: { height: 238, overflow: "hidden", borderRadius: theme.radius.card, backgroundColor: theme.colors.authSurface },
  copy: { gap: theme.spacing.xxs, paddingHorizontal: theme.spacing.xxs },
  title: { color: theme.colors.white },
  location: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xxs },
  metadata: { flex: 1, color: theme.colors.authTextSecondary },
  times: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  time: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.authSurface },
  timeSelected: { backgroundColor: theme.colors.white },
  timeText: { color: theme.colors.authTextSecondary },
  timeTextSelected: { color: theme.colors.black },
  action: { minHeight: 84, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: theme.spacing.xl, borderRadius: theme.radius.sheet, backgroundColor: theme.colors.accent },
  actionTitle: { color: theme.colors.black },
  actionMeta: { color: theme.colors.black, opacity: 0.64 },
  actionIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.black },
  pressed: { opacity: 0.76 },
});
