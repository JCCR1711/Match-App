import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

interface AuthTextFieldProps extends TextInputProps {
  label: string;
  errorMessage?: string | null;
  isValid?: boolean;
}

const AuthTextField = ({ label, errorMessage, isValid = false, style, ...props }: AuthTextFieldProps) => (
  <View style={styles.group}>
    <CustomText text={label} variant="body" />
    <TextInput
      {...props}
      placeholderTextColor={theme.colors.authTextSecondary}
      style={[styles.input, isValid && styles.valid, errorMessage && styles.error, style]}
    />
    {errorMessage ? <CustomText text={errorMessage} variant="caption" style={styles.errorText} accessibilityRole="alert" /> : null}
  </View>
);

export default AuthTextField;

const styles = StyleSheet.create({
  group: { gap: theme.spacing.sm },
  input: {
    height: 62,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "transparent",
    color: theme.colors.authText,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    ...theme.typography.input,
  },
  valid: { color: theme.colors.black, borderColor: theme.colors.accent, backgroundColor: theme.colors.accent },
  error: { borderColor: "rgba(255, 255, 255, 0.3)" },
  errorText: { color: theme.colors.authTextSecondary },
});
