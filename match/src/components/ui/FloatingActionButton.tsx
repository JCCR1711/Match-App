import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import { theme } from "@/src/theme";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { StyleSheet } from "react-native";

interface FloatingActionButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  bottom?: number;
}

const FloatingActionButton = ({ onPress, accessibilityLabel, disabled, bottom = theme.spacing.xl }: FloatingActionButtonProps) => (
  <CustomButton
    icon={<CustomIcon icon={Add01Icon} color={theme.colors.black} size={27} strokeWidth={2.7} />}
    size="icon"
    variant="secondary"
    onPress={onPress}
    disabled={disabled}
    style={[styles.button, { bottom }]}
    accessibilityLabel={accessibilityLabel}
  />
);

export default FloatingActionButton;

const styles = StyleSheet.create({
  button: { position: "absolute", right: theme.spacing.lg, zIndex: 12, width: 56, height: 56, minHeight: 56, borderRadius: theme.radius.pill, borderWidth: 0, backgroundColor: theme.colors.white },
});
