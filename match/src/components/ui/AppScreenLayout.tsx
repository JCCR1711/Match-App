import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import { type AppBackgroundVariant } from "@/src/components/ui/AppBackground";
import AppKeyboardAwareScrollView from "@/src/components/ui/AppKeyboardAwareScrollView";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppScreenLayoutProps {
  title: string;
  headerTitleAlign?: "left" | "center";
  headerTitleSize?: "default" | "compact";
  headerTitleMode?: "standard" | "scroll";
  children: ReactNode;
  footer?: ReactNode;
  backgroundVariant?: AppBackgroundVariant;
  backgroundOverlay?: ReactNode;
  onBack?: () => void;
  backAccessibilityLabel?: string;
  backIconVariant?: "back" | "dismiss";
  headerAction?: ReactNode;
  headerGlassTint?: string;
  contentStyle?: StyleProp<ViewStyle>;
  hasTabBar?: boolean;
  keyboardAware?: boolean;
}

/** Standard full-screen layout for feature views with a collapsible header and scrollable content. */
const AppScreenLayout = ({
  title,
  headerTitleAlign,
  headerTitleSize,
  headerTitleMode = "standard",
  children,
  footer,
  backgroundVariant = "content",
  backgroundOverlay,
  onBack,
  backAccessibilityLabel,
  backIconVariant,
  headerAction,
  headerGlassTint,
  contentStyle,
  hasTabBar,
  keyboardAware = false,
}: AppScreenLayoutProps) => {
  return (
    <AppScreenFrame
      title={title}
      headerTitleAlign={headerTitleAlign}
      headerTitleSize={headerTitleSize}
      headerTitleMode={headerTitleMode}
      backgroundVariant={backgroundVariant}
      backgroundOverlay={backgroundOverlay}
      onBack={onBack}
      backAccessibilityLabel={backAccessibilityLabel}
      backIconVariant={backIconVariant}
      headerAction={headerAction}
      headerGlassTint={headerGlassTint}
      hasTabBar={hasTabBar}
    >
      {({ onScroll, headerContentInset, contentBottomInset }) => (
      <View style={styles.body}>
        <AppKeyboardAwareScrollView
          enabled={keyboardAware}
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: headerContentInset + (
                headerTitleSize === "compact"
                  ? theme.spacing.xl
                  : theme.layout.headerContentGap
              ),
              paddingBottom: footer ? theme.layout.sectionGap : contentBottomInset,
            },
            contentStyle,
          ]}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {headerTitleMode === "scroll" ? <CustomText text={title} variant="body" style={styles.scrollTitle} numberOfLines={1} /> : null}
          {children}
        </AppKeyboardAwareScrollView>
        {footer ? (
          <SafeAreaView edges={["bottom"]} style={styles.footerSafeArea}>
            <View style={styles.footer}>{footer}</View>
          </SafeAreaView>
        ) : null}
      </View>
      )}
    </AppScreenFrame>
  );
};

export default AppScreenLayout;

const styles = StyleSheet.create({
  body: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenGutter,
    gap: theme.layout.sectionGap,
  },
  footerSafeArea: { backgroundColor: theme.colors.fixedFooterSurface },
  footer: {
    paddingHorizontal: theme.layout.screenGutter,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  scrollTitle: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: -0.35,
  },
});
