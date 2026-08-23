import CustomText from "@/src/components/ui/CustomText";
import GlassHeader from "@/src/components/ui/GlassHeader";
import BusinessDashboardHeader, { BUSINESS_DASHBOARD_HEADER_HEIGHT } from "@/src/features/dashboard/components/BusinessDashboardHeader";
import BusinessDashboardOverview from "@/src/features/dashboard/components/BusinessDashboardOverview";
import type { BusinessSetupKind } from "@/src/features/dashboard/components/BusinessSetupCard";
import BusinessSetupCard from "@/src/features/dashboard/components/BusinessSetupCard";
import AppBackground from "@/src/components/ui/AppBackground";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { settlements } from "@/src/features/payments/data/paymentsPreview";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DashboardView = () => {
  const { draft, loading, error } = useBusinessDraft();
  const { user } = useAuth();
  const { reservations, blocks } = useReservations();
  const insets = useSafeAreaInsets();
  const businessName = draft?.businessName || "Match Arena";
  const venues = draft?.venues ?? [];
  const fields = draft?.fields ?? [];
  const pendingField = fields.find((field) => !field.availability);
  const todayKey = reservationDates[0].dateKey;
  const todayReservations = reservations.filter((reservation) => reservation.dateKey === todayKey);
  const todayBlocks = blocks.filter((block) => block.dateKey === todayKey);
  const scheduledMinutes = fields.reduce((total, field) => {
    if (!field.availability) return total;
    const [openHour, openMinute] = field.availability.openingTime.split(":").map(Number);
    const [closeHour, closeMinute] = field.availability.closingTime.split(":").map(Number);
    return total + Math.max(0, (closeHour * 60 + closeMinute) - (openHour * 60 + openMinute));
  }, 0);
  const occupiedMinutes = [...todayReservations.filter((reservation) => reservation.status !== "canceled"), ...todayBlocks]
    .reduce((total, item) => total + item.durationMinutes, 0);
  const availableHours = Math.max(0, Math.floor((scheduledMinutes - occupiedMinutes) / 60));

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
    router.navigate({
      pathname: "/(tabs)/business-reservations",
      params: {
        reservationId: reservation.id,
        dateKey: reservation.dateKey,
        fieldId: reservation.fieldId,
      },
    });
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
      <GlassHeader topInset={insets.top} contentHeight={BUSINESS_DASHBOARD_HEADER_HEIGHT}>
        <BusinessDashboardHeader
          businessName={businessName}
          profileName={user?.displayName || "Propietario"}
          profileSeed={user?.id || user?.displayName || "business-owner"}
          avatarId={user?.avatarId}
          onOpenProfile={() => router.navigate("/(tabs)/business-profile")}
        />
      </GlassHeader>
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + BUSINESS_DASHBOARD_HEADER_HEIGHT + theme.spacing.xl,
            paddingBottom: insets.bottom + theme.layout.tabBarClearance,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <CustomText
            text="Preparando tu inicio"
            variant="body"
            style={styles.centeredMessage}
          />
        ) : error ? (
          <CustomText
            text={error}
            variant="body"
            style={styles.centeredMessage}
            accessibilityRole="alert"
          />
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
                onOpenReservations={() => router.navigate("/(tabs)/business-reservations")}
                onOpenReservation={handleOpenReservation}
                todayReservations={todayReservations}
                availableHours={availableHours}
                settlement={settlements[0]}
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
    marginVertical: "auto",
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  content: {
    flex: 1,
    gap: theme.layout.sectionGap,
  },
});
