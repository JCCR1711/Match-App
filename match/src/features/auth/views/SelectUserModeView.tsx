import AppFormIntro from "@/src/components/ui/AppFormIntro";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomText from "@/src/components/ui/CustomText";
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

          {error ? (
            <CustomText
              text={error}
              variant="caption"
              style={styles.errorText}
              accessibilityRole="alert"
            />
          ) : null}

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
  errorText: {
    color: theme.colors.errorSoft,
    textAlign: "center",
  },
});
