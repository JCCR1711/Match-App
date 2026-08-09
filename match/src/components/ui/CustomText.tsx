import { theme } from "@/src/theme";
import { forwardRef } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";

type TextVariant = keyof typeof theme.typography;

interface CustomTextProps extends TextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  colorText?: string;
  variant?: TextVariant;
}

const CustomText = forwardRef<Text, CustomTextProps>(
  ({ text, style, colorText, variant = "body", ...props }, ref) => (
    <Text
      ref={ref}
      {...props}
      style={[
        styles.text,
        theme.typography[variant],
        colorText ? { color: colorText } : null,
        style,
      ]}
    >
      {text}
    </Text>
  ),
);

CustomText.displayName = "CustomText";

export default CustomText;

const styles = StyleSheet.create({
  text: {
    color: theme.colors.text,
  },
});
