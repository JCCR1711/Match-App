import CustomButton, { type CustomButtonProps } from "@/src/components/ui/CustomButton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet } from "react-native";

interface ReservationSheetActionButtonProps extends Omit<CustomButtonProps, "variant" | "style" | "labelStyle"> {
  tone?: "primary" | "secondary" | "destructive";
}

const ReservationSheetActionButton = ({ tone = "primary", ...props }: ReservationSheetActionButtonProps) => (
  <CustomButton
    {...props}
    variant={tone === "primary" ? "light" : "secondary"}
    style={styles.button}
    labelStyle={tone === "destructive" ? styles.destructiveLabel : undefined}
  />
);

export default memo(ReservationSheetActionButton);

const styles = StyleSheet.create({
  button: { minHeight: 58, borderRadius: theme.radius.pill },
  destructiveLabel: { color: theme.colors.errorSoft },
});
