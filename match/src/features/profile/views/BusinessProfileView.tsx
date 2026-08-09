import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import ProfileActionSection, { type ProfileActionItem } from "@/src/features/profile/components/ProfileActionSection";
import ProfileInformationSection, { type ProfileInformationItem } from "@/src/features/profile/components/ProfileInformationSection";
import VenueSetupBackground from "@/src/features/venues/components/VenueSetupBackground";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { Building03Icon, FootballIcon, LegalDocument01Icon, Logout01Icon, Mail01Icon, MapsLocation01Icon, Settings02Icon, UserShield01Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessProfileView = () => {
  const { user, logout } = useAuth();
  const { draft } = useBusinessDraft();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
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
      router.replace("/auth/onboarding");
    }
  };
  const navigationActions: ProfileActionItem[] = [
    { key: "venues", icon: Building03Icon, label: "Gestionar sedes", onPress: () => router.navigate("/(tabs)/business-fields") },
    { key: "legal", icon: LegalDocument01Icon, label: "Términos y privacidad", onPress: () => router.push("/legal/terms-and-privacy") },
  ];
  const sessionActions: ProfileActionItem[] = [
    { key: "logout", icon: Logout01Icon, label: "Cerrar sesión", destructive: true, onPress: () => void handleLogout() },
  ];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <VenueSetupBackground />
      <AppScreenHeader title={user?.displayName ?? "Tu perfil"} scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.ScrollView
          contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.xl }]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          <ProfileInformationSection title="Cuenta" items={accountInformation} />
          <ProfileInformationSection title="Negocio" items={businessInformation} />
          <ProfileActionSection title="Administración" items={navigationActions} />
          <ProfileActionSection title="Sesión" items={sessionActions} />
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BusinessProfileView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge * 2 + theme.spacing.lg, gap: theme.spacing.huge },
});
