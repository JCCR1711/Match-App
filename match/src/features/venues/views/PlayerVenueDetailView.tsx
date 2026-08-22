import AppBackground from "@/src/components/ui/AppBackground";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { isSlotUnavailable } from "@/src/features/reservations/utils/isSlotUnavailable";
import { publicVenuesPreview } from "@/src/features/venues/data/publicVenuesPreview";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PlayerVenueDetailView = () => {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const venue = publicVenuesPreview.find((item) => item.id === venueId);
  const { reservations, blocks, isHydrated } = useReservations();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const [selectedDateId, setSelectedDateId] = useState<(typeof reservationDates)[number]["id"]>("today");
  const selectedDate = reservationDates.find((date) => date.id === selectedDateId) ?? reservationDates[0];
  const isFieldSlotUnavailable = (fieldId: string, startTime: string) => {
    return isSlotUnavailable({ fieldId, dateKey: selectedDate.dateKey, startTime, reservations, blocks });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground />
      <AppScreenHeader title={venue?.name || "Cancha"} onBack={() => router.back()} scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.ScrollView
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.layout.headerContentGap }]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {venue ? (
            <>
              <View style={styles.hero}>
                <Image source={getVenueImage(venue.id)} style={StyleSheet.absoluteFill} contentFit="cover" transition={220} />
                <LinearGradient colors={["transparent", theme.colors.mediaScrimStrong]} style={StyleSheet.absoluteFill} />
                <View style={styles.heroCopy}>
                  <CustomText text={venue.name} variant="heroTitle" style={styles.heroTitle} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.78} />
                  <View style={styles.locationRow}>
                    <CustomIcon icon={Location01Icon} color={theme.colors.textOnMediaSecondary} size={18} />
                    <CustomText text={`${venue.district} · ${venue.distanceLabel}`} variant="caption" style={styles.location} />
                  </View>
                </View>
              </View>
              <View style={styles.section}>
                <CustomText text="Elige tu cancha" variant="sectionHeading" style={styles.sectionTitle} />
                <CustomText text={`Horarios disponibles para ${selectedDate.label.toLowerCase()}.`} variant="body" style={styles.description} />
              </View>
              <View style={styles.dateSelector} accessibilityRole="tablist">
                {reservationDates.map((date) => {
                  const selected = date.id === selectedDateId;

                  return (
                    <Pressable
                      key={date.id}
                      accessibilityRole="tab"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Mostrar horarios para ${date.label}`}
                      onPress={() => setSelectedDateId(date.id)}
                      style={({ pressed }) => [styles.dateOption, selected && styles.dateOptionSelected, pressed && styles.pressed]}
                    >
                      <CustomText text={date.label} variant="caption" style={[styles.dateOptionText, selected && styles.dateOptionTextSelected]} />
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.fieldList}>
                {venue.fields.map((field) => {
                  const unavailableSlots = new Set(
                    field.availableSlots.filter((slot) => isFieldSlotUnavailable(field.id, slot)),
                  );
                  const availableSlots = isHydrated
                    ? field.availableSlots.filter((slot) => !unavailableSlots.has(slot))
                    : [];

                  return (
                    <AppSurface key={field.id} style={styles.fieldCard}>
                      <View style={styles.fieldHeader}>
                        <View style={styles.fieldCopy}>
                          <CustomText text={field.name} variant="action" style={styles.fieldName} />
                          <CustomText text={field.format} variant="caption" style={styles.format} />
                        </View>
                        <CustomText text={`S/ ${field.hourlyPrice}`} variant="actionSecondary" style={styles.price} />
                      </View>
                      <View style={styles.slotRow}>
                        {availableSlots.map((slot) => (
                          <Pressable
                            key={slot}
                            accessibilityRole="button"
                            accessibilityLabel={`Reservar ${field.name} a las ${slot}`}
                            onPress={() => router.push({ pathname: "/reservations/new", params: { venueId: venue.id, fieldId: field.id, slot, dateId: selectedDate.id } })}
                            style={({ pressed }) => [styles.slot, pressed && styles.slotPressed]}
                          >
                            <CustomText text={slot} variant="caption" style={styles.slotText} />
                          </Pressable>
                        ))}
                        {availableSlots.length === 0 ? (
                          <CustomText
                            text={isHydrated ? "Sin horarios disponibles" : "Cargando horarios..."}
                            variant="caption"
                            style={styles.emptySlots}
                          />
                        ) : null}
                      </View>
                    </AppSurface>
                  );
                })}
              </View>
            </>
          ) : (
            <CustomText text="No encontramos esta cancha." variant="body" style={styles.emptyState} />
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PlayerVenueDetailView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: theme.layout.screenGutter, paddingBottom: theme.layout.tabBarClearance + theme.layout.sectionGap, gap: theme.layout.sectionGap },
  hero: { aspectRatio: 1.35, justifyContent: "flex-end", overflow: "hidden", borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  heroCopy: { gap: theme.spacing.sm, padding: theme.spacing.lg },
  heroTitle: { color: theme.colors.white },
  locationRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  location: { flex: 1, color: theme.colors.textOnMediaSecondary },
  section: { gap: theme.spacing.xs },
  sectionTitle: { color: theme.colors.white },
  description: { color: theme.colors.authTextSecondary },
  dateSelector: { flexDirection: "row", gap: theme.spacing.sm },
  dateOption: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.authBorder, borderRadius: theme.radius.pill },
  dateOptionSelected: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  dateOptionText: { color: theme.colors.authTextSecondary },
  dateOptionTextSelected: { color: theme.colors.black },
  fieldList: { gap: theme.layout.elementGap },
  fieldCard: { padding: theme.layout.cardPadding, gap: theme.layout.elementGap, borderRadius: theme.radius.extraLarge },
  fieldHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.md },
  fieldCopy: { flex: 1, gap: theme.spacing.xxs },
  fieldName: { color: theme.colors.white },
  format: { color: theme.colors.authTextSecondary },
  price: { color: theme.colors.accent, textAlign: "right" },
  slotRow: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs },
  slot: { minWidth: 62, minHeight: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.sm, borderRadius: theme.radius.pill, backgroundColor: theme.colors.backgroundAlt, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.authBorder },
  slotText: { color: theme.colors.authText },
  slotPressed: { backgroundColor: theme.colors.electricBlue, borderColor: theme.colors.electricBlue },
  emptySlots: { color: theme.colors.authTextSecondary },
  emptyState: { marginTop: "auto", marginBottom: "auto", color: theme.colors.authTextSecondary, textAlign: "center" },
  pressed: { opacity: 0.76 },
});
