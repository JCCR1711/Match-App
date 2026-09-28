import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar, { getStableSportsAvatarId } from "@/src/components/ui/SportsAvatar";
import SportsAvatarGrid from "@/src/features/profile/components/SportsAvatarGrid";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import type { SportsAvatarId } from "@/src/types/avatar";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const AvatarSelectionView = () => {
  const { user, selectAvatar } = useAuth();
  const seed = user?.id || user?.displayName || "player";
  const initialAvatarId = user?.avatarId ?? getStableSportsAvatarId(seed);
  const [selectedId, setSelectedId] = useState<SportsAvatarId>(initialAvatarId);

  const saveSelection = () => {
    selectAvatar(selectedId);
    backOrReplace("/");
  };

  return (
    <AppScreenLayout
      title="Avatar"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      onBack={() => backOrReplace("/")}
      backAccessibilityLabel="Volver al perfil"
      footer={(
        <CustomButton
          label="Guardar avatar"
          onPress={saveSelection}
          accessibilityLabel="Guardar avatar seleccionado"
          style={styles.saveButton}
        />
      )}
    >
      <View style={styles.preview}>
        <SportsAvatar seed={seed} avatarId={selectedId} size={144} />
        <View style={styles.intro}>
          <CustomText text="Elige tu avatar" variant="subtitle" style={styles.title} />
          <CustomText
            text="Será visible en tu perfil y actividad."
            variant="caption"
            style={styles.description}
          />
        </View>
      </View>
      <SportsAvatarGrid seed={seed} selectedId={selectedId} onSelect={setSelectedId} />
    </AppScreenLayout>
  );
};

export default AvatarSelectionView;

const styles = StyleSheet.create({
  preview: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.lg,
  },
  intro: {
    alignItems: "center",
    gap: theme.spacing.xxs,
  },
  title: {
    color: theme.colors.white,
    textAlign: "center",
  },
  description: {
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  saveButton: {
    borderRadius: theme.radius.pill,
  },
});
