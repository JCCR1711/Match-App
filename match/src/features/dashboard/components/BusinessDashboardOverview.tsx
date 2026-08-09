import DashboardSection from "@/src/features/dashboard/components/DashboardSection";
import DashboardStatusCard from "@/src/features/dashboard/components/DashboardStatusCard";
import FieldsCarousel from "@/src/features/dashboard/components/FieldsCarousel";
import TodaySummaryCard from "@/src/features/dashboard/components/TodaySummaryCard";
import type { BusinessOnboardingDraft } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { Calendar03Icon, CheckmarkCircle02Icon, Money03Icon, Notification02Icon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

interface BusinessDashboardOverviewProps {
  draft: BusinessOnboardingDraft;
  onOpenReservations: () => void;
  onOpenFields: () => void;
  onOpenField: (fieldId: string) => void;
  onOpenAnalytics: () => void;
  onOpenPayments: () => void;
}

const BusinessDashboardOverview = ({ draft, onOpenReservations, onOpenFields, onOpenField, onOpenAnalytics, onOpenPayments }: BusinessDashboardOverviewProps) => (
  <View style={styles.container}>
    <DashboardSection title="Hoy">
      <TodaySummaryCard onPress={onOpenAnalytics} />
    </DashboardSection>

    <DashboardSection title="Próxima reserva">
      <DashboardStatusCard
        icon={Calendar03Icon}
        title="Agenda libre"
        subtitle="No hay reservas para hoy"
        accessibilityLabel="Ver reservas"
        onPress={onOpenReservations}
      />
    </DashboardSection>

    <FieldsCarousel fields={draft.fields} venues={draft.venues} onOpenAll={onOpenFields} onOpenField={onOpenField} />

    <DashboardSection title="Finanzas">
      <DashboardStatusCard
        icon={Money03Icon}
        title="Pagos y liquidaciones"
        subtitle="Cobros, comisiones y movimientos"
        accessibilityLabel="Ver pagos y liquidaciones"
        onPress={onOpenPayments}
        accentColor={theme.colors.accent}
      />
    </DashboardSection>

    <DashboardSection title="Pendientes">
      <DashboardStatusCard
        icon={Notification02Icon}
        title="Solicitudes"
        value="0"
        accessibilityLabel="Ver solicitudes pendientes"
        onPress={onOpenReservations}
      />
    </DashboardSection>

    <DashboardSection title="Actividad reciente">
      <DashboardStatusCard
        icon={CheckmarkCircle02Icon}
        title="Todo al día"
        subtitle="Aquí aparecerán los nuevos movimientos"
      />
    </DashboardSection>
  </View>
);

export default BusinessDashboardOverview;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xxxl },
});
