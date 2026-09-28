import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomText from "@/src/components/ui/CustomText";
import LegalSection from "@/src/features/legal/components/LegalSection";
import {
  LEGAL_DOCUMENT_VERSION,
  privacySections,
  termsSections,
} from "@/src/features/legal/data/legalContent";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { StyleSheet, View } from "react-native";

const TermsPrivacyView = () => {
  return (
    <AppScreenLayout
      title="Términos y privacidad"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      onBack={() => backOrReplace("/")}
      backAccessibilityLabel="Volver"
      contentStyle={styles.content}
    >
      <View style={styles.intro}>
        <CustomText text="Información legal" variant="subtitle" style={styles.title} />
        <CustomText text={`Versión ${LEGAL_DOCUMENT_VERSION}`} variant="caption" style={styles.version} />
      </View>

        <View style={styles.documentGroup}>
          <CustomText text="Términos de uso" variant="subtitle" style={styles.documentTitle} />
          {termsSections.map((section) => (
            <LegalSection key={section.title} {...section} />
          ))}
        </View>

        <View style={styles.documentGroup}>
          <CustomText text="Política de privacidad" variant="subtitle" style={styles.documentTitle} />
          {privacySections.map((section) => (
            <LegalSection key={section.title} {...section} />
          ))}
        </View>

      <CustomText
        text="Borrador de producto sujeto a revisión legal antes del lanzamiento."
        variant="caption"
        style={styles.disclaimer}
      />
    </AppScreenLayout>
  );
};

export default TermsPrivacyView;

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xxxl,
  },
  intro: {
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.white,
  },
  version: {
    color: theme.colors.textSecondary,
  },
  documentGroup: {
    gap: theme.spacing.xl,
  },
  documentTitle: {
    color: theme.colors.white,
  },
  disclaimer: {
    color: theme.colors.textMuted,
  },
});
