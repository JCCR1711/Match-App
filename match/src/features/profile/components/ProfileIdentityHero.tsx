import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import { theme } from "@/src/theme";
import type { SportsAvatarId } from "@/src/types/avatar";
import { StyleSheet, View } from "react-native";

interface ProfileIdentityHeroProps {
  avatarId: SportsAvatarId;
  displayName: string;
  username: string;
  modeLabel: string;
  seed: string;
}

const ProfileIdentityHero = ({ avatarId, displayName, username, modeLabel, seed }: ProfileIdentityHeroProps) => (
  <View style={styles.hero}>
    <View style={styles.avatarPanel}>
      <View style={styles.avatarRing}>
        <SportsAvatar seed={seed} avatarId={avatarId} size={112} />
      </View>
    </View>
    <View style={styles.copy}>
      <CustomText text={displayName} variant="heading" style={styles.name} numberOfLines={2} />
      <CustomText text={`@${username}`} variant="caption" style={styles.username} numberOfLines={1} />
      <CustomText text={modeLabel} variant="caption" style={styles.modeLabel} />
    </View>
  </View>
);

export default ProfileIdentityHero;

const styles = StyleSheet.create({
  hero: {
    minHeight: 232,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
  },
  copy: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.xxs,
  },
  modeLabel: { paddingTop: theme.spacing.xs, color: theme.colors.authTextSecondary, fontFamily: theme.fontFamilies.outfitSemiBold },
  name: { color: theme.colors.white, fontSize: 27, lineHeight: 32, textAlign: "center" },
  username: { maxWidth: "100%", color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  avatarPanel: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarRing: {
    padding: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.controlBorderOnDark,
  },
});
