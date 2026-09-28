import AppScreenState from "@/src/components/ui/AppScreenState";
import BusinessDashboardSkeleton from "@/src/features/dashboard/components/BusinessDashboardSkeleton";
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
import { getBusinessReservations } from "@/src/features/reservations/utils/getBusinessReservations";
import { settlements } from "@/src/features/payments/data/paymentsPreview";
import { getBusinessFinanceAccess } from "@/src/features/payments/utils/businessFinanceAccess";
import { getNextPendingSettlement } from "@/src/features/payments/utils/settlementSelectors";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";
import { getVenueRoleLabel } from "@/src/features/venues/utils/venueRoleLabel";
import { getBusinessResourceAccess } from "@/src/features/venues/utils/businessResourceAccess";
import { getMarketplaceReadiness } from "@/src/features/venues/utils/getMarketplaceReadiness";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DashboardView = () => {
  const { draft, loading, error, reload } = useBusinessDraft();
  const { effectiveMembership, effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const { user } = useAuth();
  const { reservations, blocks } = useReservations(draft?.organizationId);
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const avatarScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, 72], [1, 0.84], Extrapolation.CLAMP) }],
  }));
  const businessName = draft?.businessName || "Match Arena";
  const venues = draft?.venues ?? [];
  const fields = draft?.fields ?? [];
  const canConfigureResources = getBusinessResourceAccess(effectiveRole).canConfigureResources;
  const marketplaceReady = draft ? getMarketplaceReadiness(draft).ready : false;
  const pendingField = fields.find((field) => !getEffectiveFieldSchedule(
    field,
    venues.find((venue) => venue.venueId === field.venueId),
  ));
  const todayKey = reservationDates[0].dateKey;
  const businessReservations = getBusinessReservations(reservations, fields);
  const todayReservations = businessReservations.filter((reservation) => reservation.dateKey === todayKey);
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
    if (!canConfigureResources) return;
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
      <AppBackground variant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "dashboard"} />
      <AppScreenHeader
        title={businessName}
        contextLabel={draft?.membership ? getVenueRoleLabel(draft.membership.role) : undefined}
        scrollY={scrollY}
        action={(
          <Animated.View style={avatarScaleStyle}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir perfil de ${user?.displayName || "usuario"}. Rol ${draft?.membership ? getVenueRoleLabel(draft.membership.role) : "sin asignar"}`}
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
        {loading || planLoading ? (
          <BusinessDashboardSkeleton />
        ) : error ? (
          <AppScreenState
            title="No pudimos cargar tu inicio"
            message={error}
            actionLabel="Intentarlo de nuevo"
            onAction={reload}
            style={styles.screenState}
          />
        ) : draft && !effectiveMembership.enabled ? (
          <BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} />
        ) : draft ? (
          <View style={styles.content}>
            {canConfigureResources && (venues.length === 0 || fields.length === 0 || pendingField) ? (
              <BusinessSetupCard
                kind={setupAction.kind}
                title={setupAction.title}
                onPress={handleSetup}
                accessibilityLabel={setupAction.accessibilityLabel}
                style={styles.setupCard}
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
                settlement={getBusinessFinanceAccess(effectiveRole).canViewFinances ? getNextPendingSettlement(settlements) : null}
                marketplaceLabel={draft.marketplaceStatus === "live" && marketplaceReady ? "Visible en MATCH" : "Agenda local"}
                onOpenMarketplace={canConfigureResources ? () => router.push("/business/online-reservations") : undefined}
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
  screenState: { minHeight: 420, paddingHorizontal: 0 },
  content: {
    flex: 1,
    gap: theme.layout.groupGap,
  },
  setupCard: { marginTop: theme.spacing.xs },
  avatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    overflow: "hidden",
    backgroundColor: theme.colors.authSurface,
  },
  avatarPressed: { opacity: 0.72 },
});
