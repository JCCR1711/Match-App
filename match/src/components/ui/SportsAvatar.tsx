import { theme } from "@/src/theme";
import type { SportsAvatarId } from "@/src/types/avatar";
import { Image, type ImageSource } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

export const sportsAvatarCatalog = [
  { id: "rook-core", source: require("../../assets/avatars/match-rook/core.png") },
  { id: "rook-striker", source: require("../../assets/avatars/match-rook/striker.png") },
  { id: "rook-keeper", source: require("../../assets/avatars/match-rook/keeper.png") },
  { id: "rabbit", source: require("../../assets/avatars/character-families/rabbit.png") },
  { id: "robot", source: require("../../assets/avatars/character-families/robot.png") },
  { id: "terrier", source: require("../../assets/avatars/character-families/terrier.png") },
  { id: "cat", source: require("../../assets/avatars/character-families/cat.png") },
  { id: "fox", source: require("../../assets/avatars/character-families/fox.png") },
  { id: "rhino", source: require("../../assets/avatars/character-families/rhino.png") },
  { id: "gecko", source: require("../../assets/avatars/character-families/gecko.png") },
  { id: "polar-bear", source: require("../../assets/avatars/character-families/polar-bear.png") },
] as const satisfies readonly { id: SportsAvatarId; source: ImageSource }[];

interface SportsAvatarProps {
  seed: string;
  avatarId?: SportsAvatarId;
  imageUrl?: string;
  size?: number;
}

const getStableAvatarIndex = (seed: string) => {
  let hash = 2166136261;
  for (const character of seed.trim().toLowerCase()) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % sportsAvatarCatalog.length;
};

export const getStableSportsAvatarId = (seed: string): SportsAvatarId =>
  sportsAvatarCatalog[getStableAvatarIndex(seed)].id;

const getAvatarSource = (seed: string, avatarId?: SportsAvatarId) => {
  if (avatarId) {
    return sportsAvatarCatalog.find((avatar) => avatar.id === avatarId)?.source;
  }

  return sportsAvatarCatalog[getStableAvatarIndex(seed)].source;
};

const SportsAvatar = ({ seed, avatarId, imageUrl, size = 48 }: SportsAvatarProps) => {
  const source = imageUrl ? { uri: imageUrl } : getAvatarSource(seed, avatarId);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.avatar, { width: size, height: size }]}
    >
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="center"
        transition={160}
        cachePolicy="memory-disk"
      />
    </View>
  );
};

export default memo(SportsAvatar);

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.authSurface,
  },
});
