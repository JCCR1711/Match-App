import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomText from "@/src/components/ui/CustomText";
import { getStableSportsAvatarId } from "@/src/components/ui/SportsAvatar";
import ProfileIdentityHero from "@/src/features/profile/components/ProfileIdentityHero";
import ProfileActionSection, { type ProfileActionItem } from "@/src/features/profile/components/ProfileActionSection";
import { useAuth } from "@/src/hooks/useAuth";
import { ArrowDataTransferHorizontalIcon, Calendar03Icon, LegalDocument01Icon, Logout01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";

const PlayerProfileView = () => {
  const { user, error, logout, selectUserMode, status } = useAuth();
  const profileSeed = user?.id || user?.displayName || "player";
  const selectedAvatarId = user?.avatarId ?? getStableSportsAvatarId(profileSeed);

  const profileActions: ProfileActionItem[] = [
    { key: "avatar", icon: UserIcon, label: "Cambiar avatar", onPress: () => router.push("/profile/avatar") },
    { key: "reservations", icon: Calendar03Icon, label: "Mis reservas", onPress: () => router.navigate("/(tabs)/player-reservations") },
    ...(user?.availableModes.includes("venue_manager") ? [{
      key: "business-mode",
      icon: ArrowDataTransferHorizontalIcon,
      label: status === "selectingMode" ? "Cambiando experiencia..." : "Cambiar a negocio",
      disabled: status === "selectingMode",
      onPress: () => {
        void selectUserMode("venue_manager").then((selected) => {
          if (selected) router.replace("/(tabs)/dashboard");
        });
      },
    }] : []),
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
        username={user?.username ?? "jugador"}
        modeLabel="Jugador"
      />
      {error ? <CustomText text={error} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
      <ProfileActionSection title="Tu experiencia" items={profileActions} />
      <ProfileActionSection title="Sesión" items={sessionActions} />
    </AppScreenLayout>
  );
};

export default PlayerProfileView;

const styles = StyleSheet.create({
  error: { color: theme.colors.errorSoft },
});
