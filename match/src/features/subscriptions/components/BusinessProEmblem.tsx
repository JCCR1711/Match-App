import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface BusinessProEmblemProps {
  style?: StyleProp<ViewStyle>;
  decorative?: boolean;
  contained?: boolean;
  alignRight?: boolean;
}

const BusinessProEmblem = ({ style, decorative = false, contained = false, alignRight = false }: BusinessProEmblemProps) => (
  <View
    pointerEvents="none"
    accessible={!decorative}
    accessibilityRole={decorative ? undefined : "image"}
    accessibilityLabel={decorative ? undefined : "Insignia Match Pro"}
    style={[styles.frame, style]}
  >
    <Image
      source={require("@/src/assets/subscriptions/match-pro-emblem.png")}
      contentFit="contain"
      transition={180}
      accessible={false}
      style={[styles.image, contained && styles.containedImage, alignRight && styles.rightAlignedImage]}
    />
  </View>
);

export default memo(BusinessProEmblem);

const styles = StyleSheet.create({
  frame: { width: 180, height: 150 },
  image: { ...StyleSheet.absoluteFill, transform: [{ scale: 1.3 }] },
  containedImage: { transform: [{ scale: 1.12 }] },
  rightAlignedImage: { transform: [{ scale: 1.12 }, { translateX: 18 }] },
});
