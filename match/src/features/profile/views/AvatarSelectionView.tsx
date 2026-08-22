import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import SportsAvatar, { getStableSportsAvatarId } from "@/src/components/ui/SportsAvatar";
import SportsAvatarGrid from "@/src/features/profile/components/SportsAvatarGrid";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

const AvatarSelectionView = () => {
  const { user, selectAvatar } = useAuth();
  const seed = user?.id || user?.displayName || "player";
  const selectedId = user?.avatarId ?? getStableSportsAvatarId(seed);

  return (
    <AppScreenLayout title="Tu avatar" onBack={() => router.back()} backAccessibilityLabel="Volver al perfil">
      <View style={styles.preview}>
        <SportsAvatar seed={seed} avatarId={selectedId} size={144} />
      </View>
      <SportsAvatarGrid seed={seed} selectedId={selectedId} onSelect={selectAvatar} />
    </AppScreenLayout>
  );
};

export default AvatarSelectionView;

const styles = StyleSheet.create({
  preview: {
    minHeight: 184,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.separatorOnDark,
  },
});
