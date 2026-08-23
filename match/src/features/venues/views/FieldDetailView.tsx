import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import ResourceActionsMenu from "@/src/features/venues/components/ResourceActionsMenu";
import AppBackground from "@/src/components/ui/AppBackground";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { ResourceStatus } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { Location01Icon, MoreHorizontalIcon, Settings02Icon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const FieldDetailView = () => {
  const { fieldId } = useLocalSearchParams<{ fieldId: string }>();
  const { accessToken } = useAuth();
  const { draft, error, reload } = useBusinessDraft();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const [menuVisible, setMenuVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const field = draft?.fields.find((item) => item.fieldId === fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);

  const updateStatus = async (status: ResourceStatus) => {
    if (!accessToken || !draft || !field) return;
    setMenuVisible(false);
    setBusy(true);
    try { await venueOnboardingGateway.updateFieldStatus(accessToken, draft.organizationId, field.fieldId, status); reload(); }
    catch (statusError) { setActionError(statusError instanceof Error ? statusError.message : "No pudimos actualizar la cancha."); }
    finally { setBusy(false); }
  };

  const deleteField = async () => {
    if (!accessToken || !draft || !field) return;
    setBusy(true);
    try { await venueOnboardingGateway.deleteSportsField(accessToken, draft.organizationId, field.fieldId); router.back(); }
    catch (deleteError) { setActionError(deleteError instanceof Error ? deleteError.message : "No pudimos eliminar la cancha."); setBusy(false); }
  };

  const confirmDelete = () => {
    if (!field) return;
    setMenuVisible(false);
    Alert.alert("Eliminar cancha", `¿Eliminar ${field.fieldName}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => void deleteField() },
    ]);
  };

  const schedule = field?.availability ?? field?.scheduleOverride;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground />
      <AppScreenHeader title={field?.fieldName ?? "Cancha"} onBack={() => router.back()} scrollY={scrollY} action={<CustomButton icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.white} size={27} />} size="icon" variant="inverse" onPress={() => setMenuVisible(true)} style={styles.headerMenu} accessibilityLabel="Opciones de cancha" />} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.ScrollView contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.xl }]} showsVerticalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
          {venue ? <View style={styles.location}><CustomIcon icon={Location01Icon} color={theme.colors.authTextSecondary} size={23} /><CustomText text={venue.venueName} variant="body" style={styles.secondary} /></View> : null}
          <View style={styles.metrics}>
            <Metric label="Formato" value={field?.format ?? "—"} />
            <Metric label="Precio por hora" value={field ? formatSoles(field.hourlyPrice) : "—"} />
          </View>
          <AppSurface style={styles.schedule}>
            <CustomText text="Horario" variant="body" style={styles.sectionTitle} />
            <CustomText text={schedule ? `${schedule.openingTime} — ${schedule.closingTime}` : "Sin configurar"} variant="body" style={styles.scheduleValue} />
          </AppSurface>
          {error || actionError ? <CustomText text={error ?? actionError ?? ""} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
        </Animated.ScrollView>
      </SafeAreaView>
      <ResourceActionsMenu visible={menuVisible} title={field?.fieldName ?? "Cancha"} active={field?.status === "active"} disabled={busy} onClose={() => setMenuVisible(false)} onToggleStatus={() => field && void updateStatus(field.status === "active" ? "inactive" : "active")} secondaryAction={{ label: "Editar cancha", icon: Settings02Icon, onPress: () => { setMenuVisible(false); if (field) router.push({ pathname: "/business/fields/[fieldId]/edit", params: { fieldId: field.fieldId } }); } }} onDelete={confirmDelete} />
    </View>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => <AppSurface style={styles.metric}><CustomText text={label} variant="caption" style={styles.secondary} /><CustomText text={value} variant="body" style={styles.metricValue} /></AppSurface>;

export default FieldDetailView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, gap: theme.spacing.xxl, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge },
  headerMenu: { width: 42, height: 42, minHeight: 42, borderWidth: 0, backgroundColor: "transparent" },
  location: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  secondary: { color: theme.colors.authTextSecondary },
  metrics: { flexDirection: "row", gap: theme.spacing.md },
  metric: { flex: 1, gap: theme.spacing.xs, padding: theme.spacing.lg },
  metricValue: { color: theme.colors.white, fontSize: 22, fontFamily: theme.fontFamilies.poppinsBold },
  schedule: { gap: theme.spacing.sm, padding: theme.spacing.lg },
  sectionTitle: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold },
  scheduleValue: { color: theme.colors.authTextSecondary },
  error: { color: theme.colors.errorSoft },
});
