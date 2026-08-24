import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Platform, type StyleProp, StyleSheet, TextInput, type TextInputProps, View, type ViewStyle } from "react-native";

export interface AppTextFieldProps extends TextInputProps {
  label: string;
  prefix?: string;
  hasError?: boolean;
  errorMessage?: string | null;
  isValid?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppTextField = ({ label, prefix, hasError = false, errorMessage, isValid = false, containerStyle, style, ...props }: AppTextFieldProps) => (
  <View style={[styles.container, containerStyle]}>
    <CustomText text={label} variant="body" style={styles.label} />
    <View style={[styles.inputFrame, isValid && styles.inputValid, (hasError || errorMessage) && styles.inputError]}>
      {prefix ? <CustomText text={prefix} variant="bodyStrong" style={styles.prefix} /> : null}
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.authTextSecondary}
        style={[styles.input, prefix ? styles.inputWithPrefix : styles.inputWithoutPrefix, style]}
      />
    </View>
    {errorMessage ? <CustomText text={errorMessage} variant="caption" style={styles.errorText} accessibilityRole="alert" /> : null}
  </View>
);

export default AppTextField;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.sm },
  label: { color: theme.colors.textOnDarkSecondary },
  inputFrame: {
    height: 62,
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
    height: 60,
    paddingTop: Platform.OS === "android" ? 1 : 0,
    paddingBottom: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
    color: theme.colors.authText,
    fontFamily: theme.fontFamilies.outfitSemiBold,
    fontSize: theme.fontSizes.body,
    lineHeight: 20,
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: 0,
  },
  inputWithPrefix: { paddingLeft: theme.spacing.sm, paddingRight: theme.spacing.lg },
  inputWithoutPrefix: { paddingHorizontal: theme.spacing.lg },
  inputError: { borderColor: theme.colors.error },
  inputValid: { borderColor: theme.colors.controlBorderOnDark },
  errorText: { color: theme.colors.errorSoft },
});
