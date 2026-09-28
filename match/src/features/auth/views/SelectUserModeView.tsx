import AppFormIntro from "@/src/components/ui/AppFormIntro";
import AppFeedbackNotice from "@/src/components/ui/AppFeedbackNotice";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import ModeSelectionCard from "@/src/features/auth/components/ModeSelectionCard";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { UserMode } from "@/src/types/auth";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const SelectUserModeView = () => {
  const { isAuthenticated, loading, error, selectUserMode } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/email");
    }
  }, [isAuthenticated]);

  const handleModeSelection = async (mode: UserMode) => {
    const selected = await selectUserMode(mode);
    if (!selected) {
      return;
    }

    router.replace(mode === "player" ? "/(tabs)" : "/business/setup");
  };

  return (
    <AppScreenLayout
      title=""
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      onBack={() => backOrReplace("/auth/welcome")}
      backAccessibilityLabel="Volver"
    >
      <View style={styles.content}>
        <AppFormIntro
          title="Elige una"
          accentText="experiencia"
          description="Puedes cambiar de modo después."
        />
        <View style={styles.actions}>
          <ModeSelectionCard
            title="Jugar partidos"
            image={require("@/src/assets/venues/characters/venue-player-blue.png")}
            tone="player"
            onPress={() => handleModeSelection("player")}
            disabled={loading}
            accessibilityLabel="Usar Match para buscar y jugar partidos"
          />

          <ModeSelectionCard
            title="Gestionar canchas"
            image={require("@/src/assets/venues/characters/venue-player-lime.png")}
            tone="business"
            onPress={() => handleModeSelection("venue_manager")}
            disabled={loading}
            accessibilityLabel="Usar Match para administrar canchas"
          />

          {error ? <AppFeedbackNotice message={error} /> : null}

        </View>
      </View>
    </AppScreenLayout>
  );
};

export default SelectUserModeView;

const styles = StyleSheet.create({
  content: {
    gap: theme.layout.sectionGap,
  },
  actions: {
    gap: theme.spacing.lg,
  },
});
