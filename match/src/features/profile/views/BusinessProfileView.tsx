import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import { getStableSportsAvatarId } from "@/src/components/ui/SportsAvatar";
import ProfileIdentityHero from "@/src/features/profile/components/ProfileIdentityHero";
import ProfileActionSection, { type ProfileActionItem } from "@/src/features/profile/components/ProfileActionSection";
import ProfileInformationSection, { type ProfileInformationItem } from "@/src/features/profile/components/ProfileInformationSection";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { useAuth } from "@/src/hooks/useAuth";
import { Building03Icon, FootballIcon, LegalDocument01Icon, Logout01Icon, Mail01Icon, MapsLocation01Icon, Settings02Icon, UserIcon, UserShield01Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";

const BusinessProfileView = () => {
  const { user, logout, status } = useAuth();
  const profileSeed = user?.id || user?.displayName || "business-owner";
  const selectedAvatarId = user?.avatarId ?? getStableSportsAvatarId(profileSeed);
  const { draft } = useBusinessDraft();
  const venueCount = draft?.venues.length ?? 0;
  const fieldCount = draft?.fields.length ?? 0;
  const experiences = user?.availableModes.includes("player") ? "Jugador y negocio" : "Negocio";
  const accountInformation: ProfileInformationItem[] = [
    { key: "email", icon: Mail01Icon, label: "Correo", value: user?.email ?? "Sin correo" },
    { key: "role", icon: UserShield01Icon, label: "Modo actual", value: "Administrador de club" },
    { key: "experiences", icon: Settings02Icon, label: "Experiencias", value: experiences },
  ];
  const businessInformation: ProfileInformationItem[] = [
    { key: "club", icon: Building03Icon, label: "Club", value: draft?.businessName ?? "Sin configurar" },
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

  const navigationActions: ProfileActionItem[] = [
    { key: "avatar", icon: UserIcon, label: "Cambiar avatar", onPress: () => router.push("/profile/avatar") },
    { key: "venues", icon: Building03Icon, label: "Gestionar sedes", onPress: () => router.navigate("/(tabs)/business-fields") },
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
    <AppScreenLayout
      title="Perfil"
      backgroundVariant="dashboard"
      hasTabBar
    >
      <ProfileIdentityHero
        seed={profileSeed}
        avatarId={selectedAvatarId}
        displayName={user?.displayName ?? "Administrador"}
        email={user?.email ?? ""}
        modeLabel="Negocio"
      />
      <ProfileInformationSection title="Cuenta" items={accountInformation} />
      <ProfileInformationSection title="Negocio" items={businessInformation} />
      <ProfileActionSection title="Administración" items={navigationActions} />
      <ProfileActionSection title="Sesión" items={sessionActions} />
    </AppScreenLayout>
  );
};

export default BusinessProfileView;
