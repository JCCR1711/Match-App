import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";
import FieldManagementCard from "@/src/features/venues/components/FieldManagementCard";
import ResourceActionsMenu from "@/src/features/venues/components/ResourceActionsMenu";
import VenueSetupBackground from "@/src/features/venues/components/VenueSetupBackground";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { ResourceStatus, SportsFieldDraft } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { FootballIcon, Location01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const VenueDetailView = () => {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const { accessToken } = useAuth();
  const { draft, loading, error, reload } = useBusinessDraft();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [venueMenuVisible, setVenueMenuVisible] = useState(false);
  const venue = draft?.venues.find((item) => item.venueId === venueId);
  const fields = useMemo(() => draft?.fields.filter((field) => field.venueId === venueId) ?? [], [draft?.fields, venueId]);

  const updateVenueStatus = async (status: ResourceStatus) => {
    if (!accessToken || !draft || !venue) return;
    setBusyId(venue.venueId);
    try { await venueOnboardingGateway.updateVenueStatus(accessToken, draft.organizationId, venue.venueId, status); reload(); }
    catch (statusError) { setActionError(statusError instanceof Error ? statusError.message : "No pudimos actualizar la sede."); }
    finally { setBusyId(null); }
  };

  const deleteVenue = async () => {
    if (!accessToken || !draft || !venue) return;
    setBusyId(venue.venueId);
    try { await venueOnboardingGateway.deleteVenue(accessToken, draft.organizationId, venue.venueId); router.back(); }
    catch (deleteError) { setActionError(deleteError instanceof Error ? deleteError.message : "No pudimos eliminar la sede."); setBusyId(null); }
  };

  const confirmDeleteVenue = () => {
    if (!venue) return;
    setVenueMenuVisible(false);
    Alert.alert("Eliminar sede", fields.length ? `Se eliminarán ${fields.length} canchas de ${venue.venueName}.` : `¿Eliminar ${venue.venueName}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => void deleteVenue() },
    ]);
  };

  const renderField = useCallback(({ item }: { item: SportsFieldDraft }) => (
    <FieldManagementCard field={item} disabled={busyId !== null} onPress={() => router.push({ pathname: "/business/fields/[fieldId]", params: { fieldId: item.fieldId } })} />
  ), [busyId]);

  const addField = () => router.push({ pathname: "/business/fields/new", params: { venueId } });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <VenueSetupBackground />
      <AppScreenHeader title={venue?.venueName ?? "Sede"} onBack={() => router.back()} scrollY={scrollY} action={<CustomButton icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.white} size={27} />} size="icon" variant="inverse" onPress={() => setVenueMenuVisible(true)} style={styles.headerMenu} accessibilityLabel={`Opciones de ${venue?.venueName ?? "sede"}`} />} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.FlatList
          data={fields}
          renderItem={renderField}
          keyExtractor={(item) => item.fieldId}
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.xl }]}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={venue ? <View style={styles.venueSummary}><View style={styles.location}><CustomIcon icon={Location01Icon} color={theme.colors.authTextSecondary} size={25} /><CustomText text={`${venue.district}, ${venue.city}`} variant="body" style={styles.locationText} /></View>{error || actionError ? <CustomText text={error ?? actionError ?? ""} variant="caption" style={styles.error} /> : null}</View> : null}
          ListEmptyComponent={!loading ? <CustomText text="Aún no hay canchas" variant="body" style={styles.empty} /> : <CustomText text="Cargando" variant="body" style={styles.empty} />}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </SafeAreaView>
      <FloatingActionButton onPress={addField} accessibilityLabel="Añadir cancha" />
      <ResourceActionsMenu visible={venueMenuVisible} title={venue?.venueName ?? "Sede"} active={venue?.status === "active"} disabled={busyId !== null} onClose={() => setVenueMenuVisible(false)} onToggleStatus={() => { if (!venue) return; setVenueMenuVisible(false); void updateVenueStatus(venue.status === "active" ? "inactive" : "active"); }} secondaryAction={{ label: "Añadir cancha", icon: FootballIcon, onPress: () => { setVenueMenuVisible(false); addField(); } }} onDelete={confirmDeleteVenue} />
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;
export default VenueDetailView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge * 2 + theme.spacing.xl },
  venueSummary: { gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  location: { flex: 1, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  locationText: { flex: 1, color: theme.colors.authTextSecondary },
  headerMenu: { width: 42, height: 42, minHeight: 42, borderWidth: 0, backgroundColor: "transparent" },
  error: { color: theme.colors.errorSoft },
  empty: { minHeight: 260, paddingVertical: theme.spacing.huge, color: theme.colors.authTextSecondary, textAlign: "center", textAlignVertical: "center" },
  separator: { height: theme.spacing.md },
});
