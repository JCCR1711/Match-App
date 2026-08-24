import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";

interface AppFormIntroProps {
  title: string;
  accentText?: string;
  accentOnNewLine?: boolean;
  description?: string;
}

const AppFormIntro = ({
  title,
  accentText,
  accentOnNewLine = false,
  description,
}: AppFormIntroProps) => (
  <View style={styles.container}>
    {accentText && accentOnNewLine ? (
      <View accessible accessibilityRole="header" style={styles.stackedTitle}>
        <Text style={styles.stackedLead}>{title}</Text>
        <Text style={styles.stackedAccent}>
          {accentText}
        </Text>
      </View>
    ) : (
      <Text style={styles.title} accessibilityRole="header">
        {title}
        {accentText ? (
          <Text>
            {" "}{accentText}
          </Text>
        ) : null}
      </Text>
    )}
    {description ? (
      <CustomText text={description} variant="body" style={styles.description} />
    ) : null}
  </View>
);

export default AppFormIntro;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.sm },
  title: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 0,
  },
  stackedTitle: { gap: 0 },
  stackedLead: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 0,
  },
  stackedAccent: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 0,
  },
  description: { color: theme.colors.textOnDarkSecondary },
});
