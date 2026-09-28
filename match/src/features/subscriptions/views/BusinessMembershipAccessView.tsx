import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AppBackground from "@/src/components/ui/AppBackground";
import BusinessProEmblem from "@/src/features/subscriptions/components/BusinessProEmblem";
import type { BusinessMembershipRestriction } from "@/src/features/subscriptions/utils/getEffectiveBusinessMembership";
import { getVenueRoleLabel } from "@/src/features/venues/utils/venueRoleLabel";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import type { VenueRole } from "@/src/types/businessAccess";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roles: readonly VenueRole[] = ["owner", "manager", "staff"];

const BusinessMembershipAccessView = () => {
  const params = useLocalSearchParams<{ restriction?: string; role?: string }>();
  const { selectUserMode, status, user } = useAuth();
  const restriction = params.restriction as BusinessMembershipRestriction;
  const role = roles.find((candidate) => candidate === params.role) ?? null;
  const requiresPro = restriction === "team_requires_pro";
  const roleLabel = role ? getVenueRoleLabel(role) : "este rol";
  const canSwitchToPlayer = user?.availableModes.includes("player") ?? false;

  const switchToPlayer = () => {
    void selectUserMode("player").then((selected) => {
      if (selected) router.replace("/(tabs)");
    });
  };

  return (
    <View style={styles.screen}>
      <AppBackground variant={requiresPro ? "premium" : "dashboard"} />
      <SafeAreaView style={styles.safeArea} accessibilityViewIsModal>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={() => backOrReplace("/(tabs)/business-profile")} hitSlop={8} style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}>
            <CustomIcon icon={Cancel01Icon} color={theme.colors.white} size={30} strokeWidth={2.5} />
          </Pressable>
        </View>
        <View style={styles.content}>
          {requiresPro ? <BusinessProEmblem style={styles.emblem} /> : null}
          <View style={styles.copy}>
            <CustomText text={requiresPro ? "Necesitas Pro" : "Acceso no disponible"} variant="subtitle" style={styles.title} />
            <CustomText text={requiresPro ? `Pide al propietario activar Pro para continuar como ${roleLabel}.` : "No encontramos una membresía activa para esta organización."} variant="body" style={styles.message} />
          </View>
          <View style={styles.actions}>
            {requiresPro ? <CustomButton label="Ver Pro" variant="light" onPress={() => router.push("/business/plan")} style={styles.primaryAction} /> : null}
            {canSwitchToPlayer ? <Pressable accessibilityRole="button" accessibilityLabel="Usar modo jugador" disabled={status === "selectingMode"} onPress={switchToPlayer} style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}><CustomText text={status === "selectingMode" ? "Cambiando…" : "Usar modo jugador"} variant="actionSecondary" style={styles.textActionLabel} /></Pressable> : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BusinessMembershipAccessView;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  header: { zIndex: 2, minHeight: 64, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: theme.spacing.lg, backgroundColor: theme.colors.fixedFooterSurface },
  dismiss: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing.xl, paddingHorizontal: theme.spacing.xxl, paddingBottom: 56 },
  emblem: { width: 260, height: 195 },
  copy: { alignItems: "center", gap: theme.spacing.md },
  title: { color: theme.colors.white, textAlign: "center" },
  message: { maxWidth: 340, color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  actions: { width: "100%", gap: theme.spacing.md, marginTop: theme.spacing.md },
  primaryAction: { width: "100%", borderRadius: theme.radius.pill },
  textAction: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  textActionLabel: { color: theme.colors.white },
  pressed: { opacity: 0.68 },
});
