import { theme } from "@/src/theme";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";

interface CustomTextTitleProps extends TextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  colorText?: string;
}

const CustomTextTitle = ({
  text,
  style,
  colorText,
  ...props
}: CustomTextTitleProps) => {
  return (
    <Text
      {...props}
      style={[styles.text, colorText ? { color: colorText } : null, style]}
    >
      {text}
    </Text>
  );
};

export default CustomTextTitle;

const styles = StyleSheet.create({
  text: {
    ...theme.typography.display,
    color: theme.colors.accent,
    textAlign: "center",
  },
});
