import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";
import { LegalSectionContent } from "../data/legalContent";

const LegalSection = ({ title, paragraphs }: LegalSectionContent) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    {paragraphs.map((paragraph) => (
      <CustomText
        key={paragraph}
        text={paragraph}
        variant="body"
        style={styles.paragraph}
      />
    ))}
  </View>
);

export default LegalSection;

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.authText,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: theme.fontSizes.subtitle,
    lineHeight: theme.lineHeights.subtitle,
  },
  paragraph: {
    color: theme.colors.authTextSecondary,
  },
});
