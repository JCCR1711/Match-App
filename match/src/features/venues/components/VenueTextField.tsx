import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface VenueTextFieldProps extends TextInputProps {
  label: string;
  hasError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const VenueTextField = ({
  label,
  hasError = false,
  containerStyle,
  style,
  ...props
}: VenueTextFieldProps) => (
  <View style={[styles.container, containerStyle]}>
    <CustomText text={label} variant="body" />
    <TextInput
      {...props}
      style={[styles.input, hasError && styles.inputError, style]}
      placeholderTextColor={theme.colors.authTextSecondary}
    />
  </View>
);

export default VenueTextField;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  input: {
    minHeight: 62,
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.authText,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    ...theme.typography.input,
  },
  inputError: {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
