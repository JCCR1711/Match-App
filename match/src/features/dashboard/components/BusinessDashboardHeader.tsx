import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import { theme } from "@/src/theme";
import type { SportsAvatarId } from "@/src/types/avatar";
import { Pressable, StyleSheet, View } from "react-native";

interface BusinessDashboardHeaderProps {
  businessName: string;
  profileName: string;
  profileSeed: string;
  avatarId?: SportsAvatarId;
  onOpenProfile: () => void;
}

export const BUSINESS_DASHBOARD_HEADER_HEIGHT = 72;

const BusinessDashboardHeader = ({ businessName, profileName, profileSeed, avatarId, onOpenProfile }: BusinessDashboardHeaderProps) => (
  <View style={styles.container}>
    <View style={styles.copy}>
      <CustomText text={businessName} variant="heading" style={styles.title} numberOfLines={1} />
    </View>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir perfil de ${profileName}`}
      onPress={onOpenProfile}
      style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
    >
      <SportsAvatar seed={profileSeed} avatarId={avatarId} size={42} />
    </Pressable>
  </View>
);

export default BusinessDashboardHeader;

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  copy: { flex: 1, minWidth: 0 },
  title: { color: theme.colors.white, fontSize: 28, lineHeight: 36 },
  avatar: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, overflow: "hidden", backgroundColor: theme.colors.authSurface },
  pressed: { opacity: 0.72 },
});
