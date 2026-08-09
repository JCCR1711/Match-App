import CustomText from "@/src/components/ui/CustomText";
import GlassHeader from "@/src/components/ui/GlassHeader";
import AuthBackButton from "@/src/features/auth/components/AuthBackButton";
import AuthFlowBackground from "@/src/features/auth/components/AuthFlowBackground";
import LegalSection from "@/src/features/legal/components/LegalSection";
import {
  LEGAL_DOCUMENT_VERSION,
  privacySections,
  termsSections,
} from "@/src/features/legal/data/legalContent";
import { theme } from "@/src/theme";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 56;

const TermsPrivacyView = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AuthFlowBackground flowVariant="legal" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + theme.spacing.xl,
            paddingBottom: insets.bottom + theme.spacing.huge,
          },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        scrollIndicatorInsets={{ top: insets.top + HEADER_HEIGHT }}
      >
        <View style={styles.intro}>
          <Text style={styles.title}>Términos y privacidad</Text>
          <CustomText
            text={`Versión ${LEGAL_DOCUMENT_VERSION}`}
            variant="body"
            style={styles.version}
          />
        </View>

        <View style={styles.document}>
          <Text style={styles.documentTitle}>Términos de uso</Text>
          {termsSections.map((section) => (
            <LegalSection key={section.title} {...section} />
          ))}

          <View style={styles.divider} />

          <Text style={styles.documentTitle}>Política de privacidad</Text>
          {privacySections.map((section) => (
            <LegalSection key={section.title} {...section} />
          ))}

          <CustomText
            text="Borrador de producto sujeto a revisión legal antes del lanzamiento."
            variant="caption"
            style={styles.disclaimer}
          />
        </View>
      </ScrollView>

      <GlassHeader topInset={insets.top} contentHeight={HEADER_HEIGHT}>
        <AuthBackButton accessibilityLabel="Volver a completar perfil" />
      </GlassHeader>
    </View>
  );
};

export default TermsPrivacyView;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.authCanvas,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xxxl,
  },
  intro: {
    gap: theme.spacing.xs,
  },
  title: {
    maxWidth: 320,
    color: theme.colors.accent,
    ...theme.typography.screenTitle,
  },
  version: {
    color: theme.colors.accentSoft,
  },
  document: {
    gap: theme.spacing.xxl,
  },
  documentTitle: {
    color: theme.colors.authText,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: theme.fontSizes.heading,
    lineHeight: theme.lineHeights.heading,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  disclaimer: {
    color: theme.colors.warning,
  },
});
