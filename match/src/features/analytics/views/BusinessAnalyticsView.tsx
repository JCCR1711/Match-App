import AppContextHelp from "@/src/components/ui/AppContextHelp";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import AppScreenState from "@/src/components/ui/AppScreenState";
import AnalyticsExportCard from "@/src/features/analytics/components/AnalyticsExportCard";
import BusinessAnalyticsSkeleton from "@/src/features/analytics/components/BusinessAnalyticsSkeleton";
import AnalyticsIncidentSummary from "@/src/features/analytics/components/AnalyticsIncidentSummary";
import AnalyticsOpportunityList from "@/src/features/analytics/components/AnalyticsOpportunityList";
import AnalyticsHeroCard from "@/src/features/analytics/components/AnalyticsHeroCard";
import AnalyticsMetricGrid from "@/src/features/analytics/components/AnalyticsMetricGrid";
import AnalyticsScopeSelector from "@/src/features/analytics/components/AnalyticsScopeSelector";
import OccupancyList from "@/src/features/analytics/components/OccupancyList";
import ReservationSourceSummary from "@/src/features/analytics/components/ReservationSourceSummary";
import type { AnalyticsRange, AnalyticsScope } from "@/src/features/analytics/types/businessAnalytics";
import { buildBusinessAnalytics, getAnalyticsReservations, getAnalyticsScopeOptions } from "@/src/features/analytics/utils/buildBusinessAnalytics";
import { exportAnalyticsCsv } from "@/src/features/analytics/services/exportAnalyticsCsv";
import { getAnalyticsOpportunities } from "@/src/features/analytics/utils/getAnalyticsOpportunities";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { createBusinessAgendaHref } from "@/src/features/reservations/utils/businessAgendaRoute";
import { toDateKey } from "@/src/features/reservations/utils/reservationDate";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import BusinessProFeatureCard from "@/src/features/subscriptions/components/BusinessProFeatureCard";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import useAppToast from "@/src/hooks/useAppToast";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";

const BusinessAnalyticsView = () => {
  const [selectedRange, setSelectedRange] = useState<AnalyticsRange>("month");
  const [selectedScope, setSelectedScope] = useState<AnalyticsScope>("all");
  const { draft, loading: draftLoading, error: draftError, reload: reloadDraft } = useBusinessDraft();
  const { reservations, blocks, loading: reservationsLoading, error: reservationsError, reload: reloadReservations } = useReservations(draft?.organizationId);
  const { showToast } = useAppToast();
  const [exporting, setExporting] = useState(false);
  const { access, effectiveMembership } = useEffectiveBusinessMembership(draft?.membership);
  const scopeOptions = useMemo(() => draft ? getAnalyticsScopeOptions(draft) : [], [draft]);
  const snapshot = useMemo(
    () => draft ? buildBusinessAnalytics({ reservations, draft, range: selectedRange, scope: selectedScope }) : null,
    [draft, reservations, selectedRange, selectedScope],
  );
  const opportunities = useMemo(
    () => draft ? getAnalyticsOpportunities({ draft, reservations, blocks, scope: selectedScope }) : [],
    [blocks, draft, reservations, selectedScope],
  );

  const handleExport = async () => {
    if (!draft || exporting) return;
    setExporting(true);
    try {
      const reportReservations = getAnalyticsReservations(reservations, selectedRange, selectedScope);
      const scopeLabel = scopeOptions.find((option) => option.id === selectedScope)?.label ?? "Todas las sedes";
      const dateKey = toDateKey(new Date());
      await exportAnalyticsCsv(
        { reservations: reportReservations, businessName: draft.businessName, periodLabel: snapshot?.periodLabel ?? selectedRange, scopeLabel },
        `MATCH_reporte_${selectedRange}_${dateKey}.csv`,
      );
      showToast({ title: "Reporte listo", message: "Puedes guardar o compartir el archivo CSV.", tone: "success" });
    } catch (error) {
      showToast({ title: "No pudimos exportar", message: error instanceof Error ? error.message : "Inténtalo nuevamente.", tone: "error" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppScreenLayout
      title="Estadísticas"
      headerTitleMode="scroll"
      backgroundVariant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "dashboard"}
      onBack={() => backOrReplace("/(tabs)/dashboard")}
      contentStyle={styles.content}
    >
      {draftLoading || reservationsLoading ? (
        <BusinessAnalyticsSkeleton />
      ) : draftError || reservationsError ? (
        <AppScreenState
          title="No pudimos cargar tus estadísticas"
          message={draftError ?? reservationsError ?? undefined}
          actionLabel="Reintentar"
          onAction={() => { void Promise.all([reloadDraft(), reloadReservations()]); }}
        />
      ) : !effectiveMembership.enabled ? (
        <BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} allowBack />
      ) : snapshot ? (
        <>
          {access.canUseConsolidatedVenueReports && scopeOptions.length > 2 ? (
            <AnalyticsScopeSelector options={scopeOptions} selectedScope={selectedScope} onScopeChange={setSelectedScope} />
          ) : null}
          <AnalyticsHeroCard metric={snapshot.metrics[0]} periodLabel={snapshot.periodLabel} revenueTrend={snapshot.revenueTrend} selectedRange={selectedRange} onRangeChange={setSelectedRange} showYear={access.analyticsHistoryDays > 30} />
          <AppSection
            title="Indicadores"
            titleAccessory={<AppContextHelp title="Indicadores" items={[
              { title: "Confirmadas", description: "Reservas aceptadas y vigentes del periodo. No incluye pendientes ni canceladas." },
              { title: "Pendientes", description: "Reservas creadas que todavía necesitan confirmación." },
              { title: "Ocupación", description: "Parte del horario disponible de tus canchas cubierta por reservas confirmadas." },
              { title: "Venta promedio", description: "Valor promedio de una reserva confirmada. No representa el depósito neto recibido." },
            ]} />}
          >
            <AnalyticsMetricGrid metrics={snapshot.metrics.filter((metric) =>
              metric.id === "reservations" ||
              metric.id === "pending" ||
              metric.id === "occupancy" ||
              (access.canUseAdvancedAnalytics && metric.id === "average_ticket")
            )} />
          </AppSection>
          <AppSection
            title="Origen de reservas"
            titleAccessory={<AppContextHelp title="Origen de reservas" items={[
              { title: "MATCH", description: "Reservas vigentes realizadas por jugadores desde MATCH." },
              { title: "Local", description: "Reservas vigentes registradas manualmente por tu equipo." },
            ]} />}
          >
            <ReservationSourceSummary items={snapshot.sources} />
          </AppSection>
          {access.canUseAdvancedAnalytics ? (
            <>
              <AppSection title="Horas que puedes vender">
                <AnalyticsOpportunityList
                  items={opportunities}
                  onPress={(item) => router.push(createBusinessAgendaHref({ dateKey: item.dateKey, fieldId: item.fieldId, focusStartTime: item.startTime }))}
                />
              </AppSection>
              <AppSection title="Rendimiento por cancha"><OccupancyList items={snapshot.occupancy} /></AppSection>
              <AppSection
                title="Cancelaciones y devoluciones"
                titleAccessory={<AppContextHelp title="Incidencias" items={[
                  { title: "Canceladas", description: "Reservas canceladas durante el periodo seleccionado." },
                  { title: "Por devolver", description: "Importe de reservas pagadas cuya devolución sigue pendiente." },
                  { title: "Devuelto", description: "Importe marcado como devuelto al jugador." },
                ]} />}
              >
                <AnalyticsIncidentSummary summary={snapshot.incidents} />
              </AppSection>
              {access.canExportReports ? (
                <AppSection title="Reporte del periodo">
                  <AnalyticsExportCard exporting={exporting} onPress={() => void handleExport()} />
                </AppSection>
              ) : null}
            </>
          ) : (
            <BusinessProFeatureCard title="Analítica avanzada" message="Compara sedes, revisa cada cancha y amplía el historial de tu negocio." onPress={() => router.push("/business/plan")} />
          )}
        </>
      ) : null}
    </AppScreenLayout>
  );
};

export default BusinessAnalyticsView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.groupGap },
});
