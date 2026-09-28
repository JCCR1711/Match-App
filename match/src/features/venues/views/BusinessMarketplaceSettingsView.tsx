import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppScreenState from "@/src/components/ui/AppScreenState";
import AppAccessRestrictedState from "@/src/components/ui/AppAccessRestrictedState";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import { getMarketplaceReadiness } from "@/src/features/venues/utils/getMarketplaceReadiness";
import { getBusinessResourceAccess } from "@/src/features/venues/utils/businessResourceAccess";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import { useAuth } from "@/src/hooks/useAuth";
import useAppToast from "@/src/hooks/useAppToast";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const BusinessMarketplaceSettingsView = () => {
  const { accessToken } = useAuth();
  const { draft, loading, error, reload, updateDraft } = useBusinessDraft();
  const { effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const canConfigureResources = getBusinessResourceAccess(effectiveRole).canConfigureResources;
  const { showToast } = useAppToast();
  const [saving, setSaving] = useState(false);
  const readiness = draft ? getMarketplaceReadiness(draft) : null;
  const live = draft?.marketplaceStatus === "live" && readiness?.ready === true;
  const close = () => backOrReplace("/(tabs)/dashboard");
  const act = async () => {
    if (!canConfigureResources || !draft || !accessToken || !readiness?.ready || saving) return;
    setSaving(true);
    try {
      updateDraft(await venueOnboardingGateway.updateMarketplaceStatus(accessToken, draft.organizationId, live ? "paused" : "live"));
      showToast({ message: live ? "Reservas online pausadas." : "Tu negocio ya es visible en MATCH.", tone: "success" });
    } catch (cause) { showToast({ message: cause instanceof Error ? cause.message : "No pudimos actualizar las reservas online." }); }
    finally { setSaving(false); }
  };
  const setup = () => {
    if (!readiness || readiness.requirement === "venue") return backOrReplace("/(tabs)/business-fields");
    if (readiness.requirement === "field") return backOrReplace("/business/fields/new");
    const activeVenueIds = new Set(
      draft?.venues
        .filter((venue) => venue.status === "active" && venue.coordinates)
        .map((venue) => venue.venueId),
    );
    const field = draft?.fields.find(
      (item) => item.status === "active" && item.hourlyPrice > 0 && activeVenueIds.has(item.venueId),
    );
    if (field) backOrReplace({ pathname: "/business/fields/[fieldId]/availability", params: { fieldId: field.fieldId } });
  };
  return <AppScreenLayout title="Reservas online" headerTitleAlign="center" headerTitleSize="compact" backgroundVariant="solid" onBack={close} backAccessibilityLabel="Volver" backIconVariant="back" footer={draft && canConfigureResources ? <CustomButton label={saving ? "Actualizando..." : !readiness?.ready ? "Completar configuración" : live ? "Pausar reservas" : "Activar reservas"} variant={live ? "secondary" : "light"} disabled={saving} onPress={readiness?.ready ? () => void act() : setup} style={styles.action} /> : undefined}>
    {loading || planLoading ? <AppScreenState kind="loading" title="Cargando configuración" style={styles.state} /> : error || !draft || !readiness ? <AppScreenState kind="error" title="No pudimos cargar esta configuración" message={error ?? undefined} actionLabel="Intentar de nuevo" onAction={reload} style={styles.state} /> : !canConfigureResources ? <AppAccessRestrictedState title="Configuración no disponible" message="Puedes consultar el estado desde Inicio. Solo un propietario o gestor puede cambiar las reservas online." onBack={close} style={styles.state} /> : <View style={styles.content}>
      <CustomText text="TU NEGOCIO" variant="label" style={styles.eyebrow} />
      <CustomText text={live ? "Visible en MATCH" : "Agenda local"} variant="heading" style={styles.title} />
      <CustomText text={live ? "Los jugadores pueden reservar los horarios disponibles de tus canchas." : "Gestionas horarios y reservas manuales sin recibir solicitudes de jugadores."} variant="body" style={styles.copy} />
      {!readiness.ready ? <CustomText text={readiness.message} variant="bodyStrong" style={styles.requirement} /> : null}
      <View style={styles.explanation}><CustomText text="Tu agenda local siempre continúa" variant="sectionHeading" style={styles.title} /><CustomText text="Activar o pausar solo cambia la visibilidad para jugadores. No elimina horarios, bloqueos ni reservas existentes." variant="body" style={styles.copy} /></View>
    </View>}
  </AppScreenLayout>;
};
export default BusinessMarketplaceSettingsView;
const styles = StyleSheet.create({ content: { gap: theme.spacing.md, paddingVertical: theme.spacing.xl }, eyebrow: { color: theme.colors.authTextSecondary, letterSpacing: 1.1 }, title: { color: theme.colors.white }, copy: { maxWidth: 350, color: theme.colors.textOnDarkSecondary }, requirement: { marginTop: theme.spacing.md, color: theme.colors.white }, explanation: { gap: theme.spacing.sm, marginTop: theme.spacing.xxl }, action: { width: "100%", borderRadius: theme.radius.pill }, state: { minHeight: 420, paddingHorizontal: 0 } });
