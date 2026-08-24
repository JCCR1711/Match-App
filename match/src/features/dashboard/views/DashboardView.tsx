import CustomText from "@/src/components/ui/CustomText";
import CustomButton from "@/src/components/ui/CustomButton";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import BusinessDashboardOverview from "@/src/features/dashboard/components/BusinessDashboardOverview";
import BusinessSetupCard, { type BusinessSetupKind } from "@/src/features/venues/components/BusinessSetupCard";
import AppBackground from "@/src/components/ui/AppBackground";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { createBusinessAgendaHref, createFocusedReservationAgendaHref } from "@/src/features/reservations/utils/businessAgendaRoute";
import { getBusinessAvailabilityOpportunity } from "@/src/features/reservations/utils/getBusinessAvailabilityOpportunity";
import { settlements } from "@/src/features/payments/data/paymentsPreview";
import { getNextPendingSettlement } from "@/src/features/payments/utils/settlementSelectors";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DashboardView = () => {
  const { draft, loading, error, reload } = useBusinessDraft();
  const { user } = useAuth();
  const { reservations, blocks } = useReservations();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const avatarScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, 72], [1, 0.84], Extrapolation.CLAMP) }],
  }));
  const businessName = draft?.businessName || "Match Arena";
  const venues = draft?.venues ?? [];
  const fields = draft?.fields ?? [];
  const pendingField = fields.find((field) => !getEffectiveFieldSchedule(
    field,
    venues.find((venue) => venue.venueId === field.venueId),
  ));
  const todayKey = reservationDates[0].dateKey;
  const todayReservations = reservations.filter((reservation) => reservation.dateKey === todayKey);
  const todayBlocks = blocks.filter((block) => block.dateKey === todayKey);
  const availabilityOpportunity = getBusinessAvailabilityOpportunity({
    dateKey: todayKey,
    fields,
    venues,
    reservations: todayReservations,
    blocks: todayBlocks,
  });
  const handleOpenOpportunity = () => {
    const slot = availabilityOpportunity.bestSlot;
    router.navigate(createBusinessAgendaHref({
      dateKey: todayKey,
      ...(slot ? { fieldId: slot.fieldId, focusStartTime: slot.startTime } : {}),
    }));
  };

  const handleSetup = () => {
    if (venues.length === 0) {
      router.push("/business/venues/new");
      return;
    }
    if (fields.length === 0) {
      router.push("/business/fields/new");
      return;
    }
    if (pendingField) {
      router.push({
        pathname: "/business/fields/[fieldId]/edit",
        params: { fieldId: pendingField.fieldId },
      });
      return;
    }
    router.navigate("/(tabs)/business-fields");
  };

  const handleOpenReservation = (reservation: ReservationRecord) => {
    router.navigate(createFocusedReservationAgendaHref(reservation));
  };

  const setupAction: {
    kind: BusinessSetupKind;
    title: string;
    accessibilityLabel: string;
  } = pendingField
    ? {
        kind: "availability",
        title: "Configura tu cancha",
        accessibilityLabel: "Editar configuración de cancha",
      }
    : venues.length > 0
      ? {
          kind: "field",
          title: "Agrega tu cancha",
          accessibilityLabel: "Agregar cancha",
        }
      : {
          kind: "venue",
          title: "Crea tu primera sede",
          accessibilityLabel: "Agregar sede",
        };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground variant="dashboard" />
      <AppScreenHeader
        title={businessName}
        scrollY={scrollY}
        action={(
          <Animated.View style={avatarScaleStyle}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir perfil de ${user?.displayName || "Propietario"}`}
              onPress={() => router.navigate("/(tabs)/business-profile")}
              style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}
            >
              <SportsAvatar seed={user?.id || user?.displayName || "business-owner"} avatarId={user?.avatarId} size={40} />
            </Pressable>
          </Animated.View>
        )}
      />
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerContentInset + theme.layout.headerContentGap,
            paddingBottom: insets.bottom + theme.layout.tabBarClearance,
          },
        ]}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingState} accessibilityLabel="Preparando tu inicio" accessibilityRole="progressbar">
            <ActivityIndicator color={theme.colors.electricBlue} size="small" />
            <CustomText text="Preparando tu inicio" variant="body" style={styles.centeredMessage} />
          </View>
        ) : error ? (
          <View style={styles.errorState}>
            <CustomText text={error} variant="body" style={styles.centeredMessage} accessibilityRole="alert" />
            <CustomButton label="Reintentar" variant="secondary" onPress={reload} accessibilityLabel="Reintentar cargar el inicio" />
          </View>
        ) : draft ? (
          <View style={styles.content}>
            {venues.length === 0 || fields.length === 0 || pendingField ? (
              <BusinessSetupCard
                kind={setupAction.kind}
                title={setupAction.title}
                onPress={handleSetup}
                accessibilityLabel={setupAction.accessibilityLabel}
              />
            ) : null}

            {venues.length > 0 ? (
              <BusinessDashboardOverview
                draft={draft}
                onOpenFields={() => router.navigate("/(tabs)/business-fields")}
                onOpenAnalytics={() => router.push("/business/analytics")}
                onOpenPayments={() => router.push("/business/payments")}
                onOpenReservations={() => router.navigate(createBusinessAgendaHref({ dateKey: todayKey }))}
                onOpenOpportunity={handleOpenOpportunity}
                onOpenPendingReservations={() => router.push({ pathname: "/business/reservations/pending", params: { dateKey: todayKey } })}
                onOpenReservation={handleOpenReservation}
                todayReservations={todayReservations}
                opportunity={availabilityOpportunity.bestSlot}
                settlement={getNextPendingSettlement(settlements)}
                onOpenField={(fieldId) =>
                  router.push({
                    pathname: "/business/fields/[fieldId]",
                    params: { fieldId },
                  })
                }
              />
            ) : null}
          </View>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
};

export default DashboardView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenGutter,
    gap: theme.spacing.md,
  },
  centeredMessage: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  loadingState: {
    flex: 1,
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.lg,
  },
  content: {
    flex: 1,
    gap: theme.layout.sectionGap,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    overflow: "hidden",
    backgroundColor: theme.colors.authSurface,
  },
  avatarPressed: { opacity: 0.72 },
});
