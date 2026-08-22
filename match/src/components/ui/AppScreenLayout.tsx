import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import { type AppBackgroundVariant } from "@/src/components/ui/AppBackground";
import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

interface AppScreenLayoutProps {
  title: string;
  children: ReactNode;
  backgroundVariant?: AppBackgroundVariant;
  onBack?: () => void;
  backAccessibilityLabel?: string;
  headerAction?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  hasTabBar?: boolean;
}

/** Standard full-screen layout for feature views with a collapsible header and scrollable content. */
const AppScreenLayout = ({
  title,
  children,
  backgroundVariant = "content",
  onBack,
  backAccessibilityLabel,
  headerAction,
  contentStyle,
  hasTabBar,
}: AppScreenLayoutProps) => {
  return (
    <AppScreenFrame title={title} backgroundVariant={backgroundVariant} onBack={onBack} backAccessibilityLabel={backAccessibilityLabel} headerAction={headerAction} hasTabBar={hasTabBar}>
      {({ onScroll, headerContentInset, contentBottomInset }) => (
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerContentInset + theme.layout.headerContentGap,
            paddingBottom: contentBottomInset,
          },
          contentStyle,
        ]}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>
      )}
    </AppScreenFrame>
  );
};

export default AppScreenLayout;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenGutter,
    gap: theme.layout.sectionGap,
  },
});
