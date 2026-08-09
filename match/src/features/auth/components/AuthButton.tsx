import CustomButton, {
  type CustomButtonProps,
} from "@/src/components/ui/CustomButton";
import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";

interface AuthButtonProps extends CustomButtonProps {
  textSize?: "primary" | "secondary";
}

const AuthButton = ({
  labelStyle,
  textSize = "primary",
  ...props
}: AuthButtonProps) => (
  <CustomButton
    {...props}
    labelStyle={[labelStyle, styles[`${textSize}Label`]]}
  />
);

export default AuthButton;

const styles = StyleSheet.create({
  primaryLabel: {
    ...theme.typography.action,
  },
  secondaryLabel: {
    ...theme.typography.actionSecondary,
  },
});
