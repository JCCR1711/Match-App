import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { type StyleProp, StyleSheet, TextInput, type TextInputProps, View, type ViewStyle } from "react-native";

export interface AppTextFieldProps extends TextInputProps {
  label: string;
  hasError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppTextField = ({ label, hasError = false, containerStyle, style, ...props }: AppTextFieldProps) => (
  <View style={[styles.container, containerStyle]}>
    <CustomText text={label} variant="body" style={styles.label} />
    <TextInput
      {...props}
      placeholderTextColor={theme.colors.authTextSecondary}
      style={[styles.input, hasError && styles.inputError, style]}
    />
  </View>
);

export default AppTextField;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.sm },
  label: { color: theme.colors.authText },
  input: {
    minHeight: 62,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: theme.colors.surfaceOnDarkSubtle,
    color: theme.colors.authText,
    ...theme.typography.input,
  },
  inputError: { borderColor: theme.colors.controlBorderOnDark },
});
