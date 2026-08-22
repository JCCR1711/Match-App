import AppSection from "@/src/components/ui/AppSection";
import BusinessAttentionCard from "@/src/features/dashboard/components/BusinessAttentionCard";
import BusinessOpportunityCard from "@/src/features/dashboard/components/BusinessOpportunityCard";
import FieldsCarousel from "@/src/features/dashboard/components/FieldsCarousel";
import SettlementPreview from "@/src/features/dashboard/components/SettlementPreview";
import TodayAgendaPreview from "@/src/features/dashboard/components/TodayAgendaPreview";
import TodaySummaryCard from "@/src/features/dashboard/components/TodaySummaryCard";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
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
  todayReservations: ReservationRecord[];
  todayBlocks: AvailabilityBlock[];
  availableHours: number;
  settlement: Settlement;
}

const BusinessDashboardOverview = ({
  draft,
  onOpenFields,
  onOpenField,
  onOpenAnalytics,
  onOpenPayments,
  onOpenReservations,
  todayReservations,
  todayBlocks,
  availableHours,
  settlement,
}: BusinessDashboardOverviewProps) => (
  <View style={styles.container}>
    <AppSection title="Hoy" actionLabel="Ver rendimiento" onAction={onOpenAnalytics}>
      <TodaySummaryCard
        revenue={todayReservations.filter((reservation) => reservation.status === "confirmed").reduce((total, reservation) => total + reservation.amount, 0)}
        reservationCount={todayReservations.filter((reservation) => reservation.status !== "canceled").length}
        pendingCount={todayReservations.filter((reservation) => reservation.status === "pending").length}
      />
    </AppSection>

    {todayReservations.find((reservation) => reservation.status === "pending") ? (
      <BusinessAttentionCard
        reservation={todayReservations.find((reservation) => reservation.status === "pending")!}
        count={todayReservations.filter((reservation) => reservation.status === "pending").length}
        onPress={onOpenReservations}
      />
    ) : null}

    <TodayAgendaPreview reservations={todayReservations.filter((reservation) => reservation.status !== "canceled")} blocks={todayBlocks} onOpenAll={onOpenReservations} />

    {availableHours > 0 ? (
      <AppSection title="Oportunidad de hoy">
        <BusinessOpportunityCard availableHours={availableHours} onPress={onOpenReservations} />
      </AppSection>
    ) : null}

    <AppSection title="Finanzas">
      <SettlementPreview settlement={settlement} onPress={onOpenPayments} />
    </AppSection>

    <FieldsCarousel fields={draft.fields} venues={draft.venues} onOpenAll={onOpenFields} onOpenField={onOpenField} />
  </View>
);

export default BusinessDashboardOverview;

const styles = StyleSheet.create({ container: { gap: theme.layout.sectionGap } });
