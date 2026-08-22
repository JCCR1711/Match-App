import { theme } from "@/src/theme";
import { type ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";

type CustomButtonVariant = "primary" | "secondary" | "inverse" | "light";
type CustomButtonSize = "default" | "icon";

export interface CustomButtonProps extends Omit<PressableProps, "children" | "style"> {
  label?: string;
  icon?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  variant?: CustomButtonVariant;
  size?: CustomButtonSize;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CustomButton = ({
  label,
  icon,
  leadingIcon,
  trailingIcon,
  variant = "primary",
  size = "default",
  style,
  labelStyle,
  disabled,
  ...props
}: CustomButtonProps) => {
  const iconOnly = size === "icon";
  const hasLeadingIcon = !iconOnly && Boolean(leadingIcon);
  const hasDistributedContent = hasLeadingIcon && Boolean(trailingIcon);
  const renderAdornment = (adornment?: ReactNode) => {
    if (typeof adornment === "string" || typeof adornment === "number") {
      return <Text style={styles[`${variant}Label`]}>{adornment}</Text>;
    }

    return adornment ?? null;
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        iconOnly && styles.iconButton,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View
        style={[
          styles.content,
          hasDistributedContent && styles.distributedContent,
        ]}
      >
        {iconOnly ? renderAdornment(icon) : null}
        {hasLeadingIcon ? renderAdornment(leadingIcon) : null}
        {label ? (
          <Text
            style={[
              styles[`${variant}Label`],
              hasDistributedContent && styles.distributedLabel,
              labelStyle,
            ]}
          >
            {label}
          </Text>
        ) : null}
        {!iconOnly ? renderAdornment(trailingIcon) : null}
      </View>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: theme.radius.large,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  primary: {
    backgroundColor: theme.colors.electricBlue,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  inverse: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceAlt,
    shadowOpacity: 0,
    elevation: 0,
  },
  light: {
    backgroundColor: theme.colors.white,
  },
  iconButton: {
    width: 52,
    minHeight: 52,
    height: 52,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 0,
  },
  content: {
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  distributedContent: {
    width: "100%",
  },
  distributedLabel: {
    flex: 1,
    textAlign: "left",
  },
  primaryLabel: {
    ...theme.typography.button,
    color: theme.colors.white,
  } as TextStyle,
  secondaryLabel: {
    ...theme.typography.button,
    color: theme.colors.white,
  } as TextStyle,
  inverseLabel: {
    ...theme.typography.button,
    color: theme.colors.white,
  } as TextStyle,
  lightLabel: {
    ...theme.typography.button,
    color: theme.colors.black,
  } as TextStyle,
  pressed: {
    opacity: 0.84,
  },
  disabled: {
    opacity: 0.42,
  },
});
