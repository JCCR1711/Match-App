import CustomIcon from "@/src/components/ui/CustomIcon";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface AppCardArrowProps {
  backgroundColor: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}

const AppCardArrow = ({ backgroundColor, color, style }: AppCardArrowProps) => (
  <View style={[styles.container, { backgroundColor }, style]}>
    <CustomIcon icon={ArrowRight01Icon} color={color} size={24} strokeWidth={3} />
  </View>
);

export default AppCardArrow;

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
  },
});
