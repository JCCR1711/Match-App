import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import CustomText from "@/src/components/ui/CustomText";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";
import VenueCreateMenu from "@/src/features/venues/components/VenueCreateMenu";
import VenueOverviewCard from "@/src/features/venues/components/VenueOverviewCard";
import ResourceActionsMenu from "@/src/features/venues/components/ResourceActionsMenu";
import VenueSetupBackground from "@/src/features/venues/components/VenueSetupBackground";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { VenueLocation } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { FootballIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessFieldsView = () => {
  const { accessToken } = useAuth();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const { draft, loading, error, reload } = useBusinessDraft();
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const [deletingVenueId, setDeletingVenueId] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const deleteVenue = useCallback(async (venueId: string) => {
    if (!accessToken || !draft) return;
    setDeletingVenueId(venueId);
    setActionError(null);
    try {
      await venueOnboardingGateway.deleteVenue(accessToken, draft.organizationId, venueId);
      reload();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "No pudimos eliminar la sede.");
    } finally {
      setDeletingVenueId(null);
    }
  }, [accessToken, draft, reload]);

  const confirmDelete = useCallback((venue: VenueLocation) => {
    setSelectedVenue(null);
    const fieldCount = draft?.fields.filter((field) => field.venueId === venue.venueId).length ?? 0;
    Alert.alert("Eliminar sede", fieldCount > 0 ? `Se eliminarán ${fieldCount} canchas de ${venue.venueName}.` : `¿Eliminar ${venue.venueName}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => void deleteVenue(venue.venueId) },
    ]);
  }, [deleteVenue, draft?.fields]);

  const toggleVenueStatus = async () => {
    if (!accessToken || !draft || !selectedVenue) return;
    const venue = selectedVenue;
    setSelectedVenue(null);
    setDeletingVenueId(venue.venueId);
    try {
      await venueOnboardingGateway.updateVenueStatus(accessToken, draft.organizationId, venue.venueId, venue.status === "active" ? "inactive" : "active");
      reload();
    } catch (statusError) {
      setActionError(statusError instanceof Error ? statusError.message : "No pudimos actualizar la sede.");
    } finally {
      setDeletingVenueId(null);
    }
  };

  const renderVenue = useCallback(({ item }: { item: VenueLocation }) => {
    const fieldCount = draft?.fields.filter((field) => field.venueId === item.venueId).length ?? 0;
    return (
      <VenueOverviewCard
        name={item.venueName}
        location={`${item.district}, ${item.city}`}
        fieldCount={fieldCount}
        onPress={() => router.push({ pathname: "/business/venues/[venueId]", params: { venueId: item.venueId } })}
        onOpenMenu={() => setSelectedVenue(item)}
      />
    );
  }, [draft?.fields]);

  const openCreation = (kind: "venue" | "field") => {
    setCreateMenuVisible(false);
    router.push(kind === "venue" ? "/business/venues/new" : "/business/fields/new");
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <VenueSetupBackground />
      <AppScreenHeader title="Sedes" scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.FlatList
          data={draft?.venues ?? []}
          renderItem={renderVenue}
          keyExtractor={(item) => item.venueId}
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.xl }]}
          ItemSeparatorComponent={VenueSeparator}
          ListHeaderComponent={error || actionError ? <CustomText text={error ?? actionError ?? ""} variant="caption" style={styles.message} accessibilityRole="alert" /> : null}
          ListEmptyComponent={!loading ? <EmptyVenues /> : <CustomText text="Cargando" variant="body" style={styles.message} />}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </SafeAreaView>
      <FloatingActionButton onPress={() => setCreateMenuVisible(true)} accessibilityLabel="Añadir sede o cancha" bottom={112} />
      <VenueCreateMenu visible={createMenuVisible} onClose={() => setCreateMenuVisible(false)} onCreateVenue={() => openCreation("venue")} onCreateField={() => openCreation("field")} />
      <ResourceActionsMenu
        visible={selectedVenue !== null}
        title={selectedVenue?.venueName ?? "Sede"}
        active={selectedVenue?.status === "active"}
        disabled={deletingVenueId !== null}
        onClose={() => setSelectedVenue(null)}
        onToggleStatus={() => void toggleVenueStatus()}
        secondaryAction={{
          label: "Añadir cancha",
          icon: FootballIcon,
          onPress: () => {
            const venueId = selectedVenue?.venueId;
            setSelectedVenue(null);
            if (venueId) router.push({ pathname: "/business/fields/new", params: { venueId } });
          },
        }}
        onDelete={() => selectedVenue && confirmDelete(selectedVenue)}
      />
    </View>
  );
};

const VenueSeparator = () => <View style={styles.separator} />;

const EmptyVenues = () => (
  <View style={styles.empty}>
    <CustomText text="Añade tu primera sede" variant="body" style={styles.emptyTitle} />
  </View>
);

export default BusinessFieldsView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge * 2 + theme.spacing.xl },
  separator: { height: theme.spacing.lg },
  message: { marginBottom: theme.spacing.lg, color: theme.colors.authTextSecondary, textAlign: "center" },
  empty: { flex: 1, minHeight: 360, alignItems: "center", justifyContent: "center", gap: theme.spacing.xl },
  emptyTitle: { color: theme.colors.white, fontSize: 20, fontFamily: theme.fontFamilies.poppinsBold },
});
