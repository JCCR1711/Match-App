import AppBackground from "@/src/components/ui/AppBackground";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import PlayerBookingSummaryCard from "@/src/features/reservations/components/PlayerBookingSummaryCard";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import { reservationsStore } from "@/src/features/reservations/services/MockReservationsStore";
import { publicVenuesPreview } from "@/src/features/venues/data/publicVenuesPreview";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const durations = [60, 120] as const;

const getReservationDate = (dateId?: string) =>
  reservationDates.find((date) => date.id === dateId) ?? reservationDates[0];

const PlayerReservationCreateView = () => {
  const { venueId, fieldId, slot, dateId } = useLocalSearchParams<{
    venueId: string;
    fieldId: string;
    slot: string;
    dateId?: string;
  }>();
  const { user } = useAuth();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const [durationMinutes, setDurationMinutes] = useState<(typeof durations)[number]>(60);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const venue = publicVenuesPreview.find((item) => item.id === venueId);
  const field = venue?.fields.find((item) => item.id === fieldId);
  const selectedDate = getReservationDate(dateId);
  const total = useMemo(
    () => (field ? Math.round((field.hourlyPrice * durationMinutes) / 60) : 0),
    [durationMinutes, field],
  );

  const handleConfirm = () => {
    if (!venue || !field || !slot) return;

    if (reservationsStore.isTimeRangeUnavailable(field.id, selectedDate.dateKey, slot, durationMinutes)) {
      setAvailabilityError("Ese horario ya no está disponible. Elige otro.");
      return;
    }

    reservationsStore.createReservation({
      venueId: venue.id,
      venueName: venue.name,
      fieldId: field.id,
      fieldName: field.name,
      dateKey: selectedDate.dateKey,
      dateLabel: `${selectedDate.label}, ${selectedDate.detail}`,
      startTime: slot,
      durationMinutes,
      amount: total,
      customerName: user?.displayName ?? "Jugador Match",
    });

    router.replace({
      pathname: "/reservations/confirmation",
      params: {
        venueName: venue.name,
        fieldName: field.name,
        dateLabel: `${selectedDate.label}, ${selectedDate.detail}`,
        startTime: slot,
        durationMinutes: String(durationMinutes),
        total: String(total),
      },
    });
  };

  if (!venue || !field || !slot) {
    return (
      <View style={styles.root}>
        <AppBackground />
        <AppScreenHeader title="Reservar" onBack={() => router.back()} scrollY={scrollY} />
        <View style={styles.emptyState}>
          <CustomText text="No encontramos el horario seleccionado." variant="body" style={styles.emptyText} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground />
      <AppScreenHeader title="Reservar" onBack={() => router.back()} scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.ScrollView
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.layout.headerContentGap }]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.dateSummary}>
            <CustomText text={selectedDate.label} variant="sectionHeading" style={styles.dateTitle} />
            <CustomText text={selectedDate.detail} variant="body" style={styles.dateDetail} />
          </View>

          <OptionSection title="Duración">
            <View style={styles.durationRow} accessibilityRole="tablist">
              {durations.map((duration) => {
                const selected = duration === durationMinutes;
                const label = `${duration / 60} ${duration === 60 ? "hora" : "horas"}`;

                return (
                  <Pressable
                    key={duration}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Reservar por ${label}`}
                    onPress={() => {
                      setDurationMinutes(duration);
                      setAvailabilityError(null);
                    }}
                    style={({ pressed }) => [styles.durationOption, selected && styles.durationOptionSelected, pressed && styles.pressed]}
                  >
                    <CustomText text={label} variant="caption" style={[styles.optionLabel, selected && styles.durationOptionLabelSelected]} />
                  </Pressable>
                );
              })}
            </View>
          </OptionSection>

          <PlayerBookingSummaryCard
            venueName={venue.name}
            fieldName={field.name}
            dateLabel={`${selectedDate.label}, ${selectedDate.detail}`}
            startTime={slot}
            durationMinutes={durationMinutes}
            total={total}
          />
        </Animated.ScrollView>
        <View style={styles.footer}>
          {availabilityError ? <CustomText text={availabilityError} variant="caption" style={styles.availabilityError} accessibilityRole="alert" /> : null}
          <CustomButton
            label="Confirmar reserva"
            trailingIcon={<CustomIcon icon={CheckmarkCircle02Icon} color={theme.colors.white} size={21} strokeWidth={2.4} />}
            onPress={handleConfirm}
            accessibilityLabel="Confirmar reserva"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const OptionSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <View style={styles.optionSection}>
    <CustomText text={title} variant="sectionHeading" style={styles.sectionTitle} />
    {children}
  </View>
);

export default PlayerReservationCreateView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: theme.layout.screenGutter, paddingBottom: theme.layout.sectionGap, gap: theme.layout.sectionGap },
  dateSummary: { gap: theme.spacing.xxs },
  dateTitle: { color: theme.colors.white },
  dateDetail: { color: theme.colors.authTextSecondary },
  optionSection: { gap: theme.layout.elementGap },
  sectionTitle: { color: theme.colors.white },
  durationRow: { flexDirection: "row", gap: theme.spacing.sm },
  durationOption: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.authBorder },
  durationOptionSelected: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  optionLabel: { color: theme.colors.authText },
  durationOptionLabelSelected: { color: theme.colors.black },
  footer: { paddingHorizontal: theme.layout.screenGutter, paddingTop: theme.layout.elementGap, paddingBottom: theme.spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.authBorder, backgroundColor: theme.colors.fixedFooterSurface },
  availabilityError: { color: theme.colors.errorSoft, textAlign: "center", paddingBottom: theme.spacing.sm },
  pressed: { opacity: 0.78 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: theme.layout.screenGutter },
  emptyText: { color: theme.colors.authTextSecondary, textAlign: "center" },
});
