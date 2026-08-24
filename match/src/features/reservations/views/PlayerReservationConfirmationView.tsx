import AppBackground from "@/src/components/ui/AppBackground";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import PlayerBookingSummaryCard from "@/src/features/reservations/components/PlayerBookingSummaryCard";
import { getVenueImageByName } from "@/src/features/venues/data/venueImages";
import { theme } from "@/src/theme";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PlayerReservationConfirmationView = () => {
  const { venueName, fieldName, dateLabel, startTime, durationMinutes, total, referenceCode } = useLocalSearchParams<{
    venueName: string;
    fieldName: string;
    dateLabel: string;
    startTime: string;
    durationMinutes: string;
    total: string;
    referenceCode: string;
  }>();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Image source={getVenueImageByName(venueName || "")} style={StyleSheet.absoluteFill} contentFit="cover" transition={220} />
            <LinearGradient colors={["transparent", theme.colors.mediaScrimStrong]} style={StyleSheet.absoluteFill} />
            <View style={styles.successCopy}>
              <View style={styles.successIcon}>
                <CustomIcon icon={CheckmarkCircle02Icon} color={theme.colors.black} size={34} strokeWidth={2.5} />
              </View>
              <CustomText text="Reserva confirmada" variant="heroTitle" style={styles.title} />
              <CustomText text="Tu cancha ya está lista." variant="body" style={styles.subtitle} />
            </View>
          </View>
          <PlayerBookingSummaryCard venueName={venueName || "Cancha"} fieldName={fieldName || ""} dateLabel={dateLabel || ""} startTime={startTime || ""} durationMinutes={Number(durationMinutes) || 60} total={Number(total) || 0} referenceCode={referenceCode || ""} />
          <View style={styles.footer}>
            <CustomButton label="Ver mis reservas" variant="primary" onPress={() => router.replace("/(tabs)/player-reservations")} accessibilityLabel="Ver mis reservas" />
            <CustomButton label="Volver al inicio" variant="inverse" onPress={() => router.replace("/(tabs)")} accessibilityLabel="Volver al inicio" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PlayerReservationConfirmationView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, justifyContent: "space-between", gap: theme.spacing.lg },
  hero: { flex: 1, minHeight: 300, maxHeight: 430, justifyContent: "flex-end", overflow: "hidden", borderRadius: theme.radius.extraLarge, borderCurve: "continuous" },
  successCopy: { alignItems: "center", gap: theme.spacing.sm, padding: theme.spacing.xl },
  successIcon: { width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.success },
  title: { color: theme.colors.white, textAlign: "center" },
  subtitle: { color: theme.colors.textOnMediaSecondary, textAlign: "center" },
  footer: { gap: theme.spacing.sm },
});
