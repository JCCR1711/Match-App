import { theme } from "@/src/theme";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";

interface SubTitleTextProps extends Omit<TextProps, "style"> {
  text: string;
  style?: StyleProp<TextStyle>;
  colorText?: string;
}

const TextSubTitle = ({
  text,
  style,
  colorText,
  ...props
}: SubTitleTextProps) => {
  return (
    <Text
      {...props}
      style={[styles.text, colorText ? { color: colorText } : null, style]}
    >
      {text}
    </Text>
  );
};

export default TextSubTitle;

const styles = StyleSheet.create({
  text: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
  } as TextStyle,
});
