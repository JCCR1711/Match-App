import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { type StyleProp, StyleSheet, TextInput, type TextInputProps, View, type ViewStyle } from "react-native";

export interface AppTextFieldProps extends TextInputProps {
  label: string;
  prefix?: string;
  hasError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppTextField = ({ label, prefix, hasError = false, containerStyle, style, ...props }: AppTextFieldProps) => (
  <View style={[styles.container, containerStyle]}>
    <CustomText text={label} variant="body" style={styles.label} />
    <View style={[styles.inputFrame, hasError && styles.inputError]}>
      {prefix ? <CustomText text={prefix} variant="bodyStrong" style={styles.prefix} /> : null}
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.authTextSecondary}
        style={[styles.input, prefix ? styles.inputWithPrefix : styles.inputWithoutPrefix, style]}
      />
    </View>
  </View>
);

export default AppTextField;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.sm },
  label: { color: theme.colors.authText },
  inputFrame: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: theme.colors.surfaceOnDarkSubtle,
    overflow: "hidden",
  },
  prefix: { paddingLeft: theme.spacing.lg, color: theme.colors.authTextSecondary },
  input: {
    minWidth: 0,
    flex: 1,
    minHeight: 60,
    paddingVertical: 0,
    color: theme.colors.authText,
    ...theme.typography.input,
  },
  inputWithPrefix: { paddingLeft: theme.spacing.sm, paddingRight: theme.spacing.lg },
  inputWithoutPrefix: { paddingHorizontal: theme.spacing.lg },
  inputError: { borderColor: theme.colors.controlBorderOnDark },
});
