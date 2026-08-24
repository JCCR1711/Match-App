import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import CustomText from "@/src/components/ui/CustomText";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import BusinessSetupCard from "@/src/features/venues/components/BusinessSetupCard";
import FieldManagementCard from "@/src/features/venues/components/FieldManagementCard";
import ResourceActionsMenu from "@/src/features/venues/components/ResourceActionsMenu";
import ResourceDeleteConfirmSheet from "@/src/features/venues/components/ResourceDeleteConfirmSheet";
import VenueCreateMenu from "@/src/features/venues/components/VenueCreateMenu";
import VenueSelectorItem from "@/src/features/venues/components/VenueSelectorItem";
import VenueSpotlight from "@/src/features/venues/components/VenueSpotlight";
import { getVenueVisual, type VenueVisual } from "@/src/features/venues/data/venueVisuals";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { hasFieldScheduleDependencies } from "@/src/features/reservations/utils/hasFieldScheduleDependencies";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { SportsFieldDraft, VenueLocation } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { Add01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const VENUE_SELECTOR_HEIGHT = 52;
const VENUE_SELECTOR_SPACING = theme.spacing.lg;
const NEXT_SECTION_PREVIEW = 72;
const MIN_VENUE_STAGE_HEIGHT = 460;
const MAX_VENUE_STAGE_HEIGHT = 480;

const BusinessFieldsView = () => {
  const { accessToken } = useAuth();
  const { height: viewportHeight } = useWindowDimensions();
  const { draft, loading, error, reload } = useBusinessDraft();
  const { reservations, blocks } = useReservations();
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const [deletingVenueId, setDeletingVenueId] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const [venueToDelete, setVenueToDelete] = useState<VenueLocation | null>(null);
  const [focusedVenueId, setFocusedVenueId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const venues = useMemo(() => draft?.venues ?? [], [draft?.venues]);
  const fields = useMemo(() => draft?.fields ?? [], [draft?.fields]);
  const focusedVenue = venues.find((venue) => venue.venueId === focusedVenueId) ?? venues[0] ?? null;
  const venueIds = useMemo(() => venues.map((venue) => venue.venueId), [venues]);
  const focusedVisual = getVenueVisual(focusedVenue?.venueId ?? "default-venue", venueIds);
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
    const venueFieldIds = fields
      .filter((field) => field.venueId === venue.venueId)
      .map((field) => field.fieldId);
    if (hasFieldScheduleDependencies(venueFieldIds, reservations, blocks)) {
      setActionError("No puedes eliminar una sede con reservas o bloqueos activos.");
      return;
    }
    setActionError(null);
    setVenueToDelete(venue);
  }, [blocks, fields, reservations]);

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
            <View style={[StyleSheet.absoluteFill, styles.venueBackdrop]} />
            <LinearGradient
              colors={[`${focusedVisual.colors[1]}94`, `${focusedVisual.colors[0]}D6`, "transparent"]}
              locations={[0, 0.34, 0.82]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0.02, y: 0.92 }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["transparent", `${theme.colors.appCanvas}5C`, theme.colors.appCanvas]}
              locations={[0.34, 0.68, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        ) : null
      }
      headerGlassTint={`${focusedVisual.colors[0]}E6`}
      headerAction={
        <View style={styles.headerActions}>
          {focusedVenue ? (
            <CustomButton
              icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.white} size={25} strokeWidth={3} />}
              size="icon"
              variant="inverse"
              onPress={() => setSelectedVenue(focusedVenue)}
              style={styles.headerAction}
              accessibilityLabel={`Opciones de ${focusedVenue.venueName}`}
            />
          ) : null}
          <CustomButton
            icon={<CustomIcon icon={Add01Icon} color={theme.colors.white} size={24} strokeWidth={2.4} />}
            size="icon"
            variant="inverse"
            onPress={() => setCreateMenuVisible(true)}
            style={styles.headerAction}
            accessibilityLabel="Añadir sede o cancha"
          />
        </View>
      }
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
                focusedVisual={focusedVisual}
                focusedFields={focusedFields}
                stageHeight={Math.max(
                  MIN_VENUE_STAGE_HEIGHT,
                  Math.min(
                    MAX_VENUE_STAGE_HEIGHT,
                    viewportHeight
                      - headerContentInset
                      - theme.layout.tabBarClearance
                      - NEXT_SECTION_PREVIEW,
                  ),
                )}
                message={error ?? actionError}
                onSelectVenue={setFocusedVenueId}
              />
            }
            ListEmptyComponent={loading ? (
              <CustomText text="Cargando" variant="body" style={styles.message} />
            ) : focusedVenue ? (
              <EmptyFields visual={focusedVisual} onPress={() => router.push({ pathname: "/business/fields/new", params: { venueId: focusedVenue.venueId } })} />
            ) : (
              <EmptyVenues onPress={() => router.push("/business/venues/new")} />
            )}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          />
          <VenueCreateMenu visible={createMenuVisible} onClose={() => setCreateMenuVisible(false)} onCreateVenue={() => openCreation("venue")} onCreateField={() => openCreation("field")} />
          <ResourceActionsMenu
            visible={selectedVenue !== null}
            title={selectedVenue?.venueName ?? "Sede"}
            active={selectedVenue?.status === "active"}
            disabled={deletingVenueId !== null}
            onClose={() => setSelectedVenue(null)}
            onToggleStatus={() => void toggleVenueStatus()}
            secondaryAction={{ label: "Editar sede", onPress: () => { const venueId = selectedVenue?.venueId; setSelectedVenue(null); if (venueId) router.push({ pathname: "/business/venues/[venueId]/edit", params: { venueId } }); } }}
            onDelete={() => selectedVenue && confirmDelete(selectedVenue)}
          />
          <ResourceDeleteConfirmSheet
            visible={venueToDelete !== null}
            resourceName={venueToDelete?.venueName ?? "Sede"}
            detail={(fieldCountByVenueId[venueToDelete?.venueId ?? ""] ?? 0) > 0 ? `También se eliminarán ${fieldCountByVenueId[venueToDelete?.venueId ?? ""]} canchas asociadas.` : "Esta acción no se puede deshacer."}
            disabled={deletingVenueId !== null}
            onClose={() => setVenueToDelete(null)}
            onConfirm={() => {
              if (!venueToDelete) return;
              const venueId = venueToDelete.venueId;
              setVenueToDelete(null);
              void deleteVenue(venueId);
            }}
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
  focusedVisual: VenueVisual;
  focusedFields: SportsFieldDraft[];
  stageHeight: number;
  message: string | null;
  onSelectVenue: (venueId: string) => void;
}

const VenueScreenHeader = ({ venues, fieldCountByVenueId, focusedVenue, focusedVisual, focusedFields, stageHeight, message, onSelectVenue }: VenueScreenHeaderProps) => (
  <View>
    {message ? <CustomText text={message} variant="caption" style={styles.message} accessibilityRole="alert" /> : null}

    {focusedVenue ? (
      <>
        <View style={[styles.venueStage, { height: stageHeight }]}>
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
          <View style={styles.spotlightSlot}>
            <VenueSpotlight
              visual={focusedVisual}
              height={Math.max(360, stageHeight - VENUE_SELECTOR_HEIGHT - VENUE_SELECTOR_SPACING)}
              name={focusedVenue.venueName}
              activeFieldCount={focusedFields.filter((field) => field.status === "active").length}
              status={focusedVenue.status}
            />
          </View>
        </View>
        <View style={styles.sectionHeading}>
          <CustomText text="Canchas" variant="sectionHeading" style={styles.sectionTitle} />
          <CustomText text={String(fieldCountByVenueId[focusedVenue.venueId] ?? 0)} variant="label" style={styles.sectionCount} />
        </View>
      </>
    ) : null}
  </View>
);

const VenueSelectorSeparator = () => <View style={styles.selectorSeparator} />;
const FieldSeparator = () => <View style={styles.fieldSeparator} />;

const EmptyVenues = ({ onPress }: { onPress: () => void }) => (
  <View style={styles.emptySetup}>
    <BusinessSetupCard kind="venue" title="Añade tu primera sede" accessibilityLabel="Añadir primera sede" onPress={onPress} />
  </View>
);

const EmptyFields = ({ visual, onPress }: { visual: VenueVisual; onPress: () => void }) => (
  <View style={styles.emptySetup}>
    <BusinessSetupCard kind="field" presentation="accent" venueVisual={visual} title="Añadir cancha" accessibilityLabel="Añadir cancha a esta sede" onPress={onPress} />
  </View>
);

export default BusinessFieldsView;

const styles = StyleSheet.create({
  venueBackdrop: { backgroundColor: theme.colors.appCanvas },
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg },
  headerActions: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xxs },
  headerAction: { width: 44, height: 44, minHeight: 44, borderWidth: 0, backgroundColor: "transparent" },
  venueStage: { marginHorizontal: -theme.layout.screenGutter },
  spotlightSlot: { marginTop: VENUE_SELECTOR_SPACING },
  selectorList: { flexGrow: 0 },
  selectorContent: { height: VENUE_SELECTOR_HEIGHT, paddingHorizontal: theme.layout.screenGutter },
  selectorSeparator: { width: theme.spacing.sm },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: theme.spacing.xxl, paddingBottom: theme.spacing.lg },
  sectionTitle: { color: theme.colors.white },
  sectionCount: { color: theme.colors.authTextSecondary, letterSpacing: 0.8, includeFontPadding: true },
  fieldSeparator: { height: theme.spacing.lg },
  message: { marginBottom: theme.spacing.md, color: theme.colors.errorSoft, textAlign: "center" },
  emptySetup: { paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xxl },
});
