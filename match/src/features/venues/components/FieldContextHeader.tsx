import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface FieldContextHeaderProps {
  fieldName: string;
  venueName: string;
}

const FieldContextHeader = ({ fieldName, venueName }: FieldContextHeaderProps) => (
  <View style={styles.container}>
    <CustomText text={fieldName} variant="subtitle" style={styles.fieldName} numberOfLines={2} />
    <CustomText text={venueName} variant="caption" style={styles.venueName} numberOfLines={1} />
  </View>
);

export default memo(FieldContextHeader);

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xxs, paddingBottom: theme.spacing.xs },
  fieldName: { color: theme.colors.white },
  venueName: { color: theme.colors.authTextSecondary },
});
