import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import { getStableSportsAvatarId } from "@/src/components/ui/SportsAvatar";
import ProfileIdentityHero from "@/src/features/profile/components/ProfileIdentityHero";
import ProfileActionSection, { type ProfileActionItem } from "@/src/features/profile/components/ProfileActionSection";
import ProfileInformationSection, { type ProfileInformationItem } from "@/src/features/profile/components/ProfileInformationSection";
import DevBusinessRoleSwitcher from "@/src/features/profile/components/DevBusinessRoleSwitcher";
import DevReservationsScenarioSwitcher from "@/src/features/profile/components/DevReservationsScenarioSwitcher";
import DevBusinessPlanSwitcher from "@/src/features/profile/components/DevBusinessPlanSwitcher";
import { useBusinessSubscription } from "@/src/features/subscriptions/hooks/useBusinessSubscription";
import { getEffectiveBusinessMembership } from "@/src/features/subscriptions/utils/getEffectiveBusinessMembership";
import { reservationQueryKeys } from "@/src/features/reservations/queries/reservationQueryKeys";
import { reservationsGateway } from "@/src/features/reservations/services";
import type { DevReservationsApiScenario } from "@/src/features/reservations/services/ReservationsGateway";
import { getBusinessFinanceAccess } from "@/src/features/payments/utils/businessFinanceAccess";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import { getVenueRoleLabel } from "@/src/features/venues/utils/venueRoleLabel";
import { getBusinessResourceAccess } from "@/src/features/venues/utils/businessResourceAccess";
import { getMarketplaceReadiness } from "@/src/features/venues/utils/getMarketplaceReadiness";
import { useAuth } from "@/src/hooks/useAuth";
import useAppToast from "@/src/hooks/useAppToast";
import { ArrowDataTransferHorizontalIcon, Building03Icon, Calendar03Icon, CreditCardIcon, FootballIcon, LegalDocument01Icon, Logout01Icon, Mail01Icon, MapsLocation01Icon, Settings02Icon, TestTube01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import type { VenueRole } from "@/src/types/businessAccess";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const BusinessProfileView = () => {
  const { user, accessToken, error, logout, selectUserMode, status, clearAuthError } = useAuth();
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();
  const profileSeed = user?.id || user?.displayName || "business-owner";
  const selectedAvatarId = user?.avatarId ?? getStableSportsAvatarId(profileSeed);
  const { draft, updateDraft } = useBusinessDraft();
  const { subscription, access: planAccess, setDevPlan, changingPlan } = useBusinessSubscription(draft?.organizationId);
  const [changingRole, setChangingRole] = useState(false);
  const [apiScenario, setApiScenario] =
    useState<DevReservationsApiScenario>("normal");
  const [changingApiScenario, setChangingApiScenario] = useState(false);

  useEffect(() => {
    if (!__DEV__ || !reservationsGateway.getDevScenario) return;
    void reservationsGateway.getDevScenario().then(setApiScenario);
  }, []);

  useEffect(() => {
    if (!error) return;
    showToast({ message: error });
    clearAuthError();
  }, [clearAuthError, error, showToast]);

  const venueCount = draft?.venues.length ?? 0;
  const fieldCount = draft?.fields.length ?? 0;
  const effectiveMembership = getEffectiveBusinessMembership(draft?.membership, planAccess);
  const financeAccess = getBusinessFinanceAccess(effectiveMembership.role);
  const canConfigureResources = getBusinessResourceAccess(effectiveMembership.role).canConfigureResources;
  const marketplaceReadiness = draft ? getMarketplaceReadiness(draft) : null;
  const experiences = user?.availableModes.includes("player") ? "Jugador y negocio" : "Negocio";
  const accountInformation: ProfileInformationItem[] = [
    { key: "email", icon: Mail01Icon, label: "Correo", value: user?.email ?? "Sin correo" },
    { key: "experiences", icon: Settings02Icon, label: "Experiencias", value: experiences },
  ];
  const businessInformation: ProfileInformationItem[] = [
    { key: "club", icon: Building03Icon, label: "Club", value: draft?.businessName ?? "Sin configurar" },
    ...(draft?.membership ? [{ key: "role", icon: UserIcon, label: "Rol", value: getVenueRoleLabel(draft.membership.role) }] : []),
    ...(effectiveMembership.restriction === "team_requires_pro" ? [{ key: "access", icon: UserIcon, label: "Acceso", value: "Suspendido por plan" }] : []),
    { key: "plan", icon: CreditCardIcon, label: "Plan", value: planAccess.effectivePlan === "pro" ? "Pro" : "Basic" },
    { key: "venues", icon: MapsLocation01Icon, label: venueCount === 1 ? "Sede" : "Sedes", value: String(venueCount) },
    { key: "fields", icon: FootballIcon, label: fieldCount === 1 ? "Cancha" : "Canchas", value: String(fieldCount) },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/auth/welcome");
    }
  };

  const handleRoleChange = async (role: VenueRole) => {
    if (!__DEV__ || !accessToken || !draft || !venueOnboardingGateway.setDevMembershipRole) return;
    setChangingRole(true);
    try {
      const updatedDraft = await venueOnboardingGateway.setDevMembershipRole(accessToken, draft.organizationId, role);
      updateDraft(updatedDraft);
      showToast({ message: `Rol cambiado a ${getVenueRoleLabel(role)}.`, tone: "success" });
    } catch (changeError) {
      showToast({ message: changeError instanceof Error ? changeError.message : "No pudimos cambiar el rol de prueba." });
    } finally {
      setChangingRole(false);
    }
  };

  const handleApiScenarioChange = async (
    scenario: DevReservationsApiScenario,
  ) => {
    if (!__DEV__ || !reservationsGateway.setDevScenario) return;
    setChangingApiScenario(true);
    try {
      await reservationsGateway.setDevScenario(scenario);
      setApiScenario(scenario);
      queryClient.removeQueries({
        queryKey: reservationQueryKeys.all,
      });
      showToast({
        message: "Escenario de reservas actualizado.",
        tone: "success",
      });
    } catch {
      showToast({ message: "No pudimos cambiar el escenario de prueba." });
    } finally {
      setChangingApiScenario(false);
    }
  };

  const navigationActions: ProfileActionItem[] = [
    ...(canConfigureResources && draft && marketplaceReadiness ? [{
      key: "marketplace",
      icon: Calendar03Icon,
      label: "Reservas desde MATCH",
      value: !marketplaceReadiness.ready
        ? "Configurar"
        : draft.marketplaceStatus === "live"
          ? "Activas"
          : "Pausadas",
      onPress: () => router.push("/business/online-reservations"),
    }] : []),
    { key: "avatar", icon: UserIcon, label: "Cambiar avatar", onPress: () => router.push("/profile/avatar") },
    { key: "venues", icon: Building03Icon, label: "Gestionar sedes", onPress: () => router.navigate("/(tabs)/business-fields") },
    { key: "plan", icon: CreditCardIcon, label: "Plan de negocio", onPress: () => router.push("/business/plan") },
    ...(financeAccess.canViewFinances ? [{
      key: "payout-account",
      icon: CreditCardIcon,
      label: "Cuenta de depósito",
      onPress: () => router.push("/business/payout-account"),
    }] : []),
    ...(user?.availableModes.includes("player") ? [{
      key: "player-mode",
      icon: ArrowDataTransferHorizontalIcon,
      label: status === "selectingMode" ? "Cambiando experiencia..." : "Cambiar a jugador",
      disabled: status === "selectingMode",
      onPress: () => {
        void selectUserMode("player").then((selected) => {
          if (selected) router.replace("/(tabs)");
        });
      },
    }] : []),
    ...(__DEV__ ? [{ key: "feedback-preview", icon: TestTube01Icon, label: "Estados de interfaz", onPress: () => router.push("/dev/feedback") }] : []),
    ...(__DEV__ ? [{ key: "sports-design-preview", icon: FootballIcon, label: "Concepto deportivo", onPress: () => router.push("/dev/sports-design") }] : []),
    { key: "legal", icon: LegalDocument01Icon, label: "Términos y privacidad", onPress: () => router.push("/legal/terms-and-privacy") },
  ];
  const sessionActions: ProfileActionItem[] = [
    {
      key: "logout",
      icon: Logout01Icon,
      label: status === "signingOut" ? "Cerrando sesión…" : "Cerrar sesión",
      destructive: true,
      disabled: status === "signingOut",
      onPress: () => void handleLogout(),
    },
  ];

  return (
    <>
      <AppScreenLayout
      title="Perfil"
      backgroundVariant="dashboard"
      hasTabBar
    >
      <ProfileIdentityHero
        seed={profileSeed}
        avatarId={selectedAvatarId}
        displayName={user?.displayName ?? "Administrador"}
        username={user?.username ?? "administrador"}
        modeLabel="Negocio"
      />
      <ProfileInformationSection title="Cuenta" items={accountInformation} />
      <ProfileInformationSection title="Negocio" items={businessInformation} />
      {__DEV__ && draft?.membership && venueOnboardingGateway.setDevMembershipRole ? (
        <DevBusinessRoleSwitcher
          value={draft.membership.role}
          disabled={changingRole}
          onChange={(role) => void handleRoleChange(role)}
        />
      ) : null}
      {__DEV__ && reservationsGateway.setDevScenario ? (
        <DevReservationsScenarioSwitcher
          value={apiScenario}
          disabled={changingApiScenario}
          onChange={(scenario) => void handleApiScenarioChange(scenario)}
        />
      ) : null}
      {__DEV__ ? (
        <DevBusinessPlanSwitcher
          value={subscription.plan}
          disabled={changingPlan}
          onChange={(plan) => void setDevPlan(plan).then(() => showToast({ message: `Plan cambiado a ${plan === "pro" ? "Pro" : "Basic"}.`, tone: "success" })).catch((planError) => showToast({ message: planError instanceof Error ? planError.message : "No pudimos cambiar el plan." }))}
        />
      ) : null}
      <ProfileActionSection title="Administración" items={navigationActions} />
      <ProfileActionSection title="Sesión" items={sessionActions} />
      </AppScreenLayout>
    </>
  );
};

export default BusinessProfileView;
