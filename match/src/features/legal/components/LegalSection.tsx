import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";
import { LegalSectionContent } from "../data/legalContent";

const LegalSection = ({ title, paragraphs }: LegalSectionContent) => (
  <View style={styles.section}>
    <CustomText text={title} variant="sectionHeading" style={styles.title} />
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
    color: theme.colors.white,
  },
  paragraph: {
    color: theme.colors.authTextSecondary,
  },
});
