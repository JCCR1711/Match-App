import AppSection from "@/src/components/ui/AppSection";
import BusinessAttentionCard from "@/src/features/dashboard/components/BusinessAttentionCard";
import BusinessOpportunityCard from "@/src/features/dashboard/components/BusinessOpportunityCard";
import FieldsCarousel from "@/src/features/dashboard/components/FieldsCarousel";
import SettlementPreview from "@/src/features/dashboard/components/SettlementPreview";
import TodayAgendaPreview from "@/src/features/dashboard/components/TodayAgendaPreview";
import TodaySummaryCard from "@/src/features/dashboard/components/TodaySummaryCard";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import type { BusinessAvailabilityOpportunity } from "@/src/features/reservations/utils/getBusinessAvailabilityOpportunity";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import type { BusinessOnboardingDraft } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface BusinessDashboardOverviewProps {
  draft: BusinessOnboardingDraft;
  onOpenFields: () => void;
  onOpenField: (fieldId: string) => void;
  onOpenAnalytics: () => void;
  onOpenPayments: () => void;
  onOpenReservations: () => void;
  onOpenOpportunity: () => void;
  onOpenPendingReservations: () => void;
  onOpenReservation: (reservation: ReservationRecord) => void;
  todayReservations: ReservationRecord[];
  opportunity: BusinessAvailabilityOpportunity["bestSlot"];
  settlement: Settlement | null;
}

const getStartMinutes = (startTime: string) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  return hours * 60 + minutes;
};

const BusinessDashboardOverview = ({
  draft,
  onOpenFields,
  onOpenField,
  onOpenAnalytics,
  onOpenPayments,
  onOpenReservations,
  onOpenOpportunity,
  onOpenPendingReservations,
  onOpenReservation,
  todayReservations,
  opportunity,
  settlement,
}: BusinessDashboardOverviewProps) => {
  const activeReservations = todayReservations.filter(isActiveReservation);
  const confirmedRevenue = todayReservations
    .filter((reservation) => reservation.status === "confirmed")
    .reduce((total, reservation) => total + reservation.amount, 0);
  const pendingReservations = todayReservations
    .filter((reservation) => reservation.status === "pending")
    .sort((first, second) => getStartMinutes(first.startTime) - getStartMinutes(second.startTime));
  const nextPendingReservation = pendingReservations[0];

  return (
  <View style={styles.container}>
    <TodaySummaryCard
      revenue={confirmedRevenue}
      reservationCount={activeReservations.length}
      pendingCount={pendingReservations.length}
      onPress={onOpenAnalytics}
    />

    {nextPendingReservation ? (
      <BusinessAttentionCard
        reservation={nextPendingReservation}
        count={pendingReservations.length}
        onPress={onOpenPendingReservations}
      />
    ) : null}

    <TodayAgendaPreview reservations={activeReservations} onOpenAll={onOpenReservations} onOpenReservation={onOpenReservation} />

    {opportunity ? (
      <AppSection title="Oportunidad de hoy">
        <BusinessOpportunityCard opportunity={opportunity} onPress={onOpenOpportunity} />
      </AppSection>
    ) : null}

    {settlement ? (
      <AppSection title="Finanzas">
        <SettlementPreview settlement={settlement} onPress={onOpenPayments} />
      </AppSection>
    ) : null}

    <FieldsCarousel fields={draft.fields} venues={draft.venues} onOpenAll={onOpenFields} onOpenField={onOpenField} />
  </View>
  );
};

export default BusinessDashboardOverview;

const styles = StyleSheet.create({ container: { gap: theme.layout.sectionGap } });
