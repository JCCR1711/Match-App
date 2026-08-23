import CustomIcon from "@/src/components/ui/CustomIcon";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

interface BusinessCardArrowProps {
  backgroundColor: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}

const BusinessCardArrow = ({
  backgroundColor,
  color,
  style,
}: BusinessCardArrowProps) => (
  <View style={[styles.container, { backgroundColor }, style]}>
    <CustomIcon
      icon={ArrowRight01Icon}
      color={color}
      size={24}
      strokeWidth={3}
    />
  </View>
);

export default BusinessCardArrow;

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
  },
});
