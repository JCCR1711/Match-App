import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AuthButton from "@/src/features/auth/components/AuthButton";
import AuthFlowBackground from "@/src/features/auth/components/AuthFlowBackground";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { UserMode } from "@/src/types/auth";
import { FootballIcon, FootballPitchIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SelectUserModeView = () => {
  const { user, isAuthenticated, loading, error, selectUserMode } = useAuth();

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
    <View style={styles.root}>
      <StatusBar style="light" />
      <AuthFlowBackground flowVariant="mode" />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.content}>
            <View style={styles.message}>
              <Text style={styles.title}>¿Qué quieres hacer?</Text>
              <CustomText
                text={`Hola, ${user?.displayName ?? ""}. Elige cómo empezar.`}
                variant="body"
                style={styles.description}
              />
            </View>

            <View style={styles.actions}>
              <AuthButton
                label="Buscar y jugar"
                leadingIcon={
                  <CustomIcon
                    icon={FootballIcon}
                    color={theme.colors.white}
                    size={24}
                  />
                }
                variant="primary"
                onPress={() => handleModeSelection("player")}
                disabled={loading}
                style={styles.primaryOption}
                accessibilityLabel="Usar Match para buscar y jugar partidos"
              />

              <AuthButton
                label="Administrar canchas"
                leadingIcon={
                  <CustomIcon
                    icon={FootballPitchIcon}
                    color={theme.colors.white}
                    size={24}
                  />
                }
                variant="inverse"
                onPress={() => handleModeSelection("venue_manager")}
                disabled={loading}
                style={styles.businessOption}
                labelStyle={styles.businessOptionLabel}
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

              <CustomText
                text="Podrás activar el otro modo más adelante."
                variant="body"
                style={styles.hint}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SelectUserModeView;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.authCanvas,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: theme.spacing.huge,
    paddingBottom: theme.spacing.xl,
  },
  message: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.authText,
    ...theme.typography.screenTitle,
  },
  description: {
    maxWidth: 320,
    color: theme.colors.authTextSecondary,
  },
  actions: {
    gap: theme.spacing.md,
  },
  primaryOption: {
    minHeight: 64,
    borderRadius: theme.radius.pill,
  },
  businessOption: {
    minHeight: 64,
    borderRadius: theme.radius.pill,
    borderColor: "rgba(255, 255, 255, 0.16)",
    backgroundColor: theme.colors.authSurface,
  },
  businessOptionLabel: {
    color: theme.colors.white,
  },
  errorText: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  hint: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
});
