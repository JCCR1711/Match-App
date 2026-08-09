import { theme } from "@/src/theme";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface OtpCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  isValid?: boolean;
}

const CODE_LENGTH = 6;

const OtpCodeInput = ({
  value,
  onChange,
  disabled = false,
  hasError = false,
  isValid = false,
}: OtpCodeInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length: CODE_LENGTH }, (_, index) => value[index]);

  const handleChange = (nextValue: string) => {
    if (disabled) {
      return;
    }

    onChange(nextValue.replace(/\D/g, "").slice(0, CODE_LENGTH));
  };

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, hasError]);

  return (
    <Pressable
      style={styles.container}
      onPress={() => inputRef.current?.focus()}
      accessibilityRole="button"
      accessibilityLabel="Editar código de verificación"
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={CODE_LENGTH}
        autoFocus
        editable
        caretHidden
        style={styles.hiddenInput}
        accessibilityLabel="Código de verificación de seis dígitos"
      />
      <View pointerEvents="none" style={styles.digits}>
        {digits.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.digitCell,
              index === value.length && !hasError && styles.activeDigitCell,
              isValid && styles.validDigitCell,
              hasError && styles.errorDigitCell,
            ]}
          >
            <Text
              style={[
                styles.digit,
                isValid && styles.validDigit,
              ]}
            >
              {digit ?? ""}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

export default OtpCodeInput;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    minHeight: 64,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    opacity: 0.01,
    color: "transparent",
  },
  digits: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  digitCell: {
    flex: 1,
    minWidth: 0,
    height: 62,
    borderRadius: theme.radius.large,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeDigitCell: {
    borderColor: "rgba(255, 255, 255, 0.52)",
  },
  errorDigitCell: {
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  validDigitCell: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accent,
  },
  digit: {
    color: theme.colors.authText,
    ...theme.typography.codeDigit,
  },
  validDigit: {
    color: theme.colors.black,
  },
});
