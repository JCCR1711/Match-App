import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import CustomText from "@/src/components/ui/CustomText";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";
import FieldManagementCard from "@/src/features/venues/components/FieldManagementCard";
import ResourceActionsMenu from "@/src/features/venues/components/ResourceActionsMenu";
import VenueCreateMenu from "@/src/features/venues/components/VenueCreateMenu";
import VenueSelectorItem from "@/src/features/venues/components/VenueSelectorItem";
import VenueSpotlight from "@/src/features/venues/components/VenueSpotlight";
import { getVenueVisual } from "@/src/features/venues/data/venueVisuals";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { SportsFieldDraft, VenueLocation } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { FootballIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const BusinessFieldsView = () => {
  const { accessToken } = useAuth();
  const { draft, loading, error, reload } = useBusinessDraft();
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const [deletingVenueId, setDeletingVenueId] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const [focusedVenueId, setFocusedVenueId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const venues = useMemo(() => draft?.venues ?? [], [draft?.venues]);
  const fields = useMemo(() => draft?.fields ?? [], [draft?.fields]);
  const focusedVenue = venues.find((venue) => venue.venueId === focusedVenueId) ?? venues[0] ?? null;
  const focusedVenueIndex = focusedVenue ? venues.findIndex((venue) => venue.venueId === focusedVenue.venueId) : -1;
  const focusedVisual = getVenueVisual(focusedVenueIndex);
  const focusedFields = useMemo(() => focusedVenue ? fields.filter((field) => field.venueId === focusedVenue.venueId) : [], [fields, focusedVenue]);
  const fieldCountByVenueId = useMemo(() => fields.reduce<Record<string, number>>((counts, field) => {
    counts[field.venueId] = (counts[field.venueId] ?? 0) + 1;
    return counts;
  }, {}), [fields]);

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

  const renderField = useCallback(({ item }: { item: SportsFieldDraft }) => (
    <FieldManagementCard
      field={item}
      subtitle={focusedVenue?.venueName}
      presentation="featured"
      disabled={deletingVenueId !== null}
      onPress={() => router.push({ pathname: "/business/fields/[fieldId]", params: { fieldId: item.fieldId } })}
    />
  ), [deletingVenueId, focusedVenue?.venueName]);

  const openCreation = (kind: "venue" | "field") => {
    setCreateMenuVisible(false);
    router.push(kind === "venue" ? "/business/venues/new" : "/business/fields/new");
  };

  return (
    <AppScreenFrame
      title="Sedes"
      backgroundVariant="dashboard"
      backgroundOverlay={
        focusedVenue ? (
          <Animated.View key={focusedVenue.venueId} entering={FadeIn.duration(220)} pointerEvents="none" style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={[focusedVisual.colors[0], focusedVisual.colors[1], theme.colors.appCanvas]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        ) : null
      }
      headerGlassTint={`${focusedVisual.colors[0]}E6`}
      hasTabBar
    >
      {({ onScroll, headerContentInset, contentBottomInset }) => (
        <>
          <Animated.FlatList
            data={focusedFields}
            renderItem={renderField}
            keyExtractor={(item) => item.fieldId}
            contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.md, paddingBottom: contentBottomInset }]}
            ItemSeparatorComponent={FieldSeparator}
            ListHeaderComponent={
              <VenueScreenHeader
                venues={venues}
                fieldCountByVenueId={fieldCountByVenueId}
                focusedVenue={focusedVenue}
                focusedVenueIndex={focusedVenueIndex}
                focusedFields={focusedFields}
                message={error ?? actionError}
                onSelectVenue={setFocusedVenueId}
                onOpenMenu={() => focusedVenue && setSelectedVenue(focusedVenue)}
              />
            }
            ListEmptyComponent={loading ? <CustomText text="Cargando" variant="body" style={styles.message} /> : focusedVenue ? <EmptyFields /> : <EmptyVenues />}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          />
          <FloatingActionButton onPress={() => setCreateMenuVisible(true)} accessibilityLabel="Añadir sede o cancha" bottom={112} />
          <VenueCreateMenu visible={createMenuVisible} onClose={() => setCreateMenuVisible(false)} onCreateVenue={() => openCreation("venue")} onCreateField={() => openCreation("field")} />
          <ResourceActionsMenu
            visible={selectedVenue !== null}
            title={selectedVenue?.venueName ?? "Sede"}
            active={selectedVenue?.status === "active"}
            disabled={deletingVenueId !== null}
            onClose={() => setSelectedVenue(null)}
            onToggleStatus={() => void toggleVenueStatus()}
            secondaryAction={{ label: "Añadir cancha", icon: FootballIcon, onPress: () => { const venueId = selectedVenue?.venueId; setSelectedVenue(null); if (venueId) router.push({ pathname: "/business/fields/new", params: { venueId } }); } }}
            onDelete={() => selectedVenue && confirmDelete(selectedVenue)}
          />
        </>
      )}
    </AppScreenFrame>
  );
};

interface VenueScreenHeaderProps {
  venues: VenueLocation[];
  fieldCountByVenueId: Record<string, number>;
  focusedVenue: VenueLocation | null;
  focusedVenueIndex: number;
  focusedFields: SportsFieldDraft[];
  message: string | null;
  onSelectVenue: (venueId: string) => void;
  onOpenMenu: () => void;
}

const VenueScreenHeader = ({ venues, fieldCountByVenueId, focusedVenue, focusedVenueIndex, focusedFields, message, onSelectVenue, onOpenMenu }: VenueScreenHeaderProps) => (
  <View>
    {message ? <CustomText text={message} variant="caption" style={styles.message} accessibilityRole="alert" /> : null}

    {focusedVenue ? (
      <>
        <FlatList
          horizontal
          data={venues}
          keyExtractor={(venue) => venue.venueId}
          renderItem={({ item, index }) => (
            <VenueSelectorItem
              index={index}
              name={item.venueName}
              fieldCount={fieldCountByVenueId[item.venueId] ?? 0}
              selected={item.venueId === focusedVenue.venueId}
              onPress={() => onSelectVenue(item.venueId)}
            />
          )}
          ItemSeparatorComponent={VenueSelectorSeparator}
          showsHorizontalScrollIndicator={false}
          style={styles.selectorList}
          contentContainerStyle={styles.selectorContent}
        />
        <VenueSpotlight
          index={focusedVenueIndex}
          name={focusedVenue.venueName}
          fieldCount={fieldCountByVenueId[focusedVenue.venueId] ?? 0}
          activeFieldCount={focusedFields.filter((field) => field.status === "active").length}
          status={focusedVenue.status}
          onOpenMenu={onOpenMenu}
        />
        <View style={styles.sectionHeading}>
          <CustomText text="Canchas" variant="sectionHeading" style={styles.sectionTitle} />
          <CustomText text={String(fieldCountByVenueId[focusedVenue.venueId] ?? 0).padStart(2, "0")} variant="label" style={styles.sectionCount} />
        </View>
      </>
    ) : null}
  </View>
);

const VenueSelectorSeparator = () => <View style={styles.selectorSeparator} />;
const FieldSeparator = () => <View style={styles.fieldSeparator} />;

const EmptyVenues = () => (
  <View style={styles.empty}>
    <CustomText text="Añade tu primera sede" variant="sectionHeading" style={styles.emptyTitle} />
  </View>
);

const EmptyFields = () => (
  <View style={styles.emptyFields}>
    <CustomText text="Aún no hay canchas en esta sede" variant="body" style={styles.emptyFieldsText} />
  </View>
);

export default BusinessFieldsView;

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg },
  selectorList: { marginHorizontal: -theme.layout.screenGutter },
  selectorContent: { paddingHorizontal: theme.layout.screenGutter, paddingBottom: theme.spacing.md },
  selectorSeparator: { width: theme.spacing.sm },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: theme.spacing.xxl, paddingBottom: theme.spacing.md },
  sectionTitle: { color: theme.colors.white },
  sectionCount: { color: theme.colors.authTextSecondary, letterSpacing: 0.8, includeFontPadding: true },
  fieldSeparator: { height: theme.spacing.md },
  message: { marginBottom: theme.spacing.md, color: theme.colors.errorSoft, textAlign: "center" },
  empty: { flex: 1, minHeight: 360, alignItems: "center", justifyContent: "center", gap: theme.spacing.xl },
  emptyTitle: { color: theme.colors.white },
  emptyFields: { minHeight: 180, alignItems: "center", justifyContent: "center" },
  emptyFieldsText: { color: theme.colors.authTextSecondary, textAlign: "center" },
});
