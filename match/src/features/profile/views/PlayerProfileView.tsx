import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import { getStableSportsAvatarId } from "@/src/components/ui/SportsAvatar";
import ProfileIdentityHero from "@/src/features/profile/components/ProfileIdentityHero";
import ProfileActionSection, { type ProfileActionItem } from "@/src/features/profile/components/ProfileActionSection";
import { useAuth } from "@/src/hooks/useAuth";
import { Calendar03Icon, LegalDocument01Icon, Logout01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";

const PlayerProfileView = () => {
  const { user, logout, status } = useAuth();
  const profileSeed = user?.id || user?.displayName || "player";
  const selectedAvatarId = user?.avatarId ?? getStableSportsAvatarId(profileSeed);

  const profileActions: ProfileActionItem[] = [
    { key: "avatar", icon: UserIcon, label: "Cambiar avatar", onPress: () => router.push("/profile/avatar") },
    { key: "reservations", icon: Calendar03Icon, label: "Mis reservas", onPress: () => router.navigate("/(tabs)/player-reservations") },
    { key: "legal", icon: LegalDocument01Icon, label: "Términos y privacidad", onPress: () => router.push("/legal/terms-and-privacy") },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/auth/welcome");
    }
  };

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
        displayName={user?.displayName ?? "Jugador"}
        email={user?.email ?? ""}
        modeLabel="Jugador"
      />
      <ProfileActionSection title="Tu experiencia" items={profileActions} />
      <ProfileActionSection title="Sesión" items={sessionActions} />
    </AppScreenLayout>
  );
};

export default PlayerProfileView;
