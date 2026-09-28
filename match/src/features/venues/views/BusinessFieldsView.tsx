import AppAccessRestrictedState from "@/src/components/ui/AppAccessRestrictedState";
import AppFeedbackNotice from "@/src/components/ui/AppFeedbackNotice";
import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { useReservations } from "@/src/features/reservations/hooks/useReservations";
import { hasFieldScheduleDependencies } from "@/src/features/reservations/utils/hasFieldScheduleDependencies";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import { canCreateFieldForPlan, canCreateVenueForPlan } from "@/src/features/subscriptions/utils/businessPlanLimits";
import BusinessSetupCard from "@/src/features/venues/components/BusinessSetupCard";
import BusinessVenuePickerSheet from "@/src/features/venues/components/BusinessVenuePickerSheet";
import BusinessVenuesSkeleton from "@/src/features/venues/components/BusinessVenuesSkeleton";
import FieldManagementCard from "@/src/features/venues/components/FieldManagementCard";
import ResourceActionsMenu from "@/src/features/venues/components/ResourceActionsMenu";
import ResourceDeleteConfirmSheet from "@/src/features/venues/components/ResourceDeleteConfirmSheet";
import ResourceStatusLabel from "@/src/features/venues/components/ResourceStatusLabel";
import VenueCreateMenu from "@/src/features/venues/components/VenueCreateMenu";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { SportsFieldDraft } from "@/src/features/venues/types/businessOnboarding";
import { getBusinessResourceAccess } from "@/src/features/venues/utils/businessResourceAccess";
import { useAuth } from "@/src/hooks/useAuth";
import useAppToast from "@/src/hooks/useAppToast";
import { theme } from "@/src/theme";
import { Add01Icon, ArrowDown01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const BusinessFieldsView = () => {
  const { accessToken } = useAuth();
  const { showToast } = useAppToast();
  const { draft, loading, error, updateDraft } = useBusinessDraft();
  const { access: planAccess, effectiveMembership, effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const { reservations, blocks } = useReservations(draft?.organizationId);
  const canConfigureResources = getBusinessResourceAccess(effectiveRole).canConfigureResources;
  const venues = useMemo(() => draft?.venues ?? [], [draft?.venues]);
  const fields = useMemo(() => draft?.fields ?? [], [draft?.fields]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [venuePickerVisible, setVenuePickerVisible] = useState(false);
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const activeVenue = venues.find((venue) => venue.venueId === selectedVenueId) ?? venues[0] ?? null;
  const activeFields = useMemo(() => activeVenue ? fields.filter((field) => field.venueId === activeVenue.venueId) : [], [activeVenue, fields]);

  const openCreation = (kind: "venue" | "field") => {
    setCreateMenuVisible(false);
    if (kind === "venue") {
      if (!canCreateVenueForPlan(planAccess, venues.length)) return router.push("/business/plan");
      return router.push("/business/venues/new");
    }
    if (!activeVenue) return;
    if (!canCreateFieldForPlan(planAccess, activeFields.length)) return router.push("/business/plan");
    router.push({ pathname: "/business/fields/new", params: { venueId: activeVenue.venueId } });
  };

  const updateStatus = async () => {
    if (!accessToken || !draft || !activeVenue || busy) return;
    setActionsVisible(false);
    setBusy(true);
    try {
      const nextStatus = activeVenue.status === "active" ? "inactive" : "active";
      const updated = await venueOnboardingGateway.updateVenueStatus(accessToken, draft.organizationId, activeVenue.venueId, nextStatus);
      updateDraft(updated);
      showToast({ message: nextStatus === "active" ? "Sede activada." : "Sede desactivada.", tone: "success" });
    } catch (updateError) {
      showToast({ message: updateError instanceof Error ? updateError.message : "No pudimos actualizar la sede." });
    } finally { setBusy(false); }
  };

  const requestDelete = () => {
    if (!activeVenue) return;
    setActionsVisible(false);
    if (hasFieldScheduleDependencies(activeFields.map((field) => field.fieldId), reservations, blocks)) {
      showToast({ message: "No puedes eliminar una sede con reservas o bloqueos activos." });
      return;
    }
    setDeleteVisible(true);
  };

  const deleteVenue = async () => {
    if (!accessToken || !draft || !activeVenue || busy) return;
    setDeleteVisible(false);
    setBusy(true);
    try {
      const updated = await venueOnboardingGateway.deleteVenue(accessToken, draft.organizationId, activeVenue.venueId);
      updateDraft(updated);
      setSelectedVenueId(null);
      showToast({ message: "Sede eliminada.", tone: "success" });
    } catch (deleteError) {
      showToast({ message: deleteError instanceof Error ? deleteError.message : "No pudimos eliminar la sede." });
    } finally { setBusy(false); }
  };

  const renderField = useCallback(({ item }: { item: SportsFieldDraft }) => (
    <FieldManagementCard field={item} presentation="list" disabled={busy} onPress={() => router.push({ pathname: "/business/fields/[fieldId]", params: { fieldId: item.fieldId } })} />
  ), [busy]);

  const selectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    setVenuePickerVisible(false);
  };

  return (
    <>
    <AppScreenFrame
      title="Sedes"
      headerTitleMode="scroll"
      backgroundVariant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "dashboard"}
      headerAction={effectiveMembership.enabled && canConfigureResources ? <CustomButton icon={<CustomIcon icon={Add01Icon} color={theme.colors.white} size={22} strokeWidth={2.4} />} size="icon" variant="inverse" onPress={() => setCreateMenuVisible(true)} hitSlop={4} style={styles.headerAction} accessibilityLabel="Crear sede o cancha" /> : null}
      hasTabBar
    >
      {({ onScroll, headerContentInset, contentBottomInset }) => loading || planLoading ? <Animated.ScrollView contentContainerStyle={[styles.stateContent, { paddingTop: headerContentInset + theme.layout.headerContentGap, paddingBottom: contentBottomInset }]}><BusinessVenuesSkeleton /></Animated.ScrollView> : draft && !effectiveMembership.enabled ? <Animated.ScrollView contentContainerStyle={[styles.stateContent, { paddingTop: headerContentInset + theme.layout.headerContentGap, paddingBottom: contentBottomInset }]}><BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} /></Animated.ScrollView> : (
        <Animated.FlatList
          data={activeFields}
          renderItem={renderField}
          keyExtractor={(item) => item.fieldId}
          contentContainerStyle={[styles.content, { paddingTop: 0, paddingBottom: contentBottomInset }]}
          ItemSeparatorComponent={FieldSeparator}
          ListHeaderComponent={<View style={styles.headerContent}>
            {error ? <AppFeedbackNotice message={error} /> : null}
            {activeVenue ? <><View style={styles.venueMedia}><Image source={getVenueImage(activeVenue.venueId)} contentFit="cover" transition={180} cachePolicy="memory-disk" style={StyleSheet.absoluteFill} /><LinearGradient pointerEvents="none" colors={[`${theme.colors.black}C0`, `${theme.colors.black}00`]} locations={[0, 1]} style={styles.mediaShade} /></View><View style={styles.venueIdentity}><View style={styles.identityCopy}><View style={styles.venueTitleRow}><Pressable onPress={() => setVenuePickerVisible(true)} accessibilityRole="button" accessibilityLabel={`Cambiar sede. Seleccionada: ${activeVenue.venueName}`} accessibilityState={{ expanded: venuePickerVisible }} style={({ pressed }) => [styles.venueTitleTrigger, pressed && styles.pressed]}><CustomText text={activeVenue.venueName} variant="screenTitle" style={styles.venueName} numberOfLines={2} /><View pointerEvents="none" style={styles.venuePickerIcon}><CustomIcon icon={ArrowDown01Icon} color={theme.colors.black} size={22} strokeWidth={3} /></View></Pressable>{canConfigureResources ? <CustomButton icon={<CustomIcon icon={MoreHorizontalIcon} color={theme.colors.black} size={23} strokeWidth={3} />} size="icon" variant="light" onPress={() => setActionsVisible(true)} style={styles.venueMenuButton} accessibilityLabel={`Opciones de ${activeVenue.venueName}`} /> : null}</View><CustomText text={`${activeVenue.district} · ${activeVenue.city}`} variant="body" style={styles.location} numberOfLines={1} /><ResourceStatusLabel status={activeVenue.status} style={styles.venueStatus} /></View></View></> : null}
            {activeVenue ? <View style={styles.sectionTitle}><CustomText text="Canchas" variant="sectionHeading" style={styles.white} /><CustomText text={String(activeFields.length)} variant="label" style={styles.count} /></View> : null}
          </View>}
          ListEmptyComponent={activeVenue ? (canConfigureResources ? <BusinessSetupCard kind="field" title="Añadir cancha" accessibilityLabel="Añadir cancha a esta sede" onPress={() => openCreation("field")} /> : <AppAccessRestrictedState title="Aún no hay canchas" message="Un propietario o gestor debe agregar una cancha." />) : (canConfigureResources ? <BusinessSetupCard kind="venue" title="Añade tu primera sede" accessibilityLabel="Añadir primera sede" onPress={() => openCreation("venue")} /> : <AppAccessRestrictedState title="Aún no hay sedes" message="Un propietario o gestor debe agregar una sede." />)}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      )}
    </AppScreenFrame>
    {canConfigureResources ? <VenueCreateMenu visible={createMenuVisible} onClose={() => setCreateMenuVisible(false)} onCreateVenue={() => openCreation("venue")} onCreateField={() => openCreation("field")} /> : null}
    <BusinessVenuePickerSheet venues={venues} selectedVenueId={activeVenue?.venueId ?? null} visible={venuePickerVisible} onClose={() => setVenuePickerVisible(false)} onSelect={selectVenue} />
    {canConfigureResources ? <ResourceActionsMenu visible={actionsVisible} title={activeVenue?.venueName ?? "Sede"} active={activeVenue?.status === "active"} disabled={busy} onClose={() => setActionsVisible(false)} onToggleStatus={() => void updateStatus()} secondaryAction={{ label: "Editar sede", onPress: () => { setActionsVisible(false); if (activeVenue) router.push({ pathname: "/business/venues/[venueId]/edit", params: { venueId: activeVenue.venueId } }); } }} onDelete={requestDelete} /> : null}
    {canConfigureResources ? <ResourceDeleteConfirmSheet visible={deleteVisible} resourceName={activeVenue?.venueName ?? "Sede"} detail={activeFields.length ? `También se eliminarán ${activeFields.length} canchas asociadas.` : "Esta acción no se puede deshacer."} disabled={busy} onClose={() => setDeleteVisible(false)} onConfirm={() => void deleteVenue()} /> : null}
    </>
  );
};

const FieldSeparator = () => <View style={styles.separator} />;
export default BusinessFieldsView;

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg },
  stateContent: { flexGrow: 1, paddingHorizontal: theme.layout.screenGutter },
  headerAction: { width: 36, height: 36, minHeight: 36, borderWidth: 0, backgroundColor: "transparent" },
  headerContent: { gap: theme.spacing.lg, paddingBottom: theme.spacing.md },
  venueMedia: { aspectRatio: 3 / 2, marginHorizontal: -theme.spacing.lg, overflow: "hidden", backgroundColor: theme.colors.authSurface },
  mediaShade: { position: "absolute", top: 0, right: 0, left: 0, height: 132 },
  venueIdentity: { paddingVertical: theme.spacing.xs },
  identityCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs, paddingBottom: theme.spacing.xxs },
  venueStatus: { marginTop: theme.spacing.xxs },
  venueTitleRow: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  venueTitleTrigger: { flex: 1, minWidth: 0, minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  venuePickerIcon: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.white },
  venueMenuButton: { width: 40, minHeight: 40, height: 40, borderWidth: 0, shadowOpacity: 0, elevation: 0 },
  venueName: { flex: 1, color: theme.colors.white, fontSize: 23, lineHeight: 28 },
  location: { color: theme.colors.authTextSecondary },
  sectionTitle: { minHeight: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  white: { color: theme.colors.white },
  count: { color: theme.colors.authTextSecondary },
  separator: { height: theme.spacing.sm },
  pressed: { opacity: 0.72 },
});
