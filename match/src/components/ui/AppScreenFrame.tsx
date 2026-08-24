import AppBackground, { type AppBackgroundVariant } from "@/src/components/ui/AppBackground";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import { COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT, useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AppScreenFrameRenderProps = ReturnType<typeof useCollapsibleHeader> & {
  contentBottomInset: number;
};

interface AppScreenFrameProps {
  title: string;
  headerTitleAlign?: "left" | "center";
  headerTitleSize?: "default" | "compact";
  headerTitleMode?: "standard" | "scroll";
  children: (layout: AppScreenFrameRenderProps) => ReactNode;
  backgroundVariant?: AppBackgroundVariant;
  backgroundOverlay?: ReactNode;
  onBack?: () => void;
  backAccessibilityLabel?: string;
  backIconVariant?: "back" | "dismiss";
  headerAction?: ReactNode;
  headerGlassTint?: string;
  hasTabBar?: boolean;
}

/** Shared edge-to-edge canvas and collapsible header for scroll and virtualized screens. */
const AppScreenFrame = ({
  title,
  headerTitleAlign,
  headerTitleSize,
  headerTitleMode = "standard",
  children,
  backgroundVariant = "content",
  backgroundOverlay,
  onBack,
  backAccessibilityLabel,
  backIconVariant,
  headerAction,
  headerGlassTint,
  hasTabBar = false,
}: AppScreenFrameProps) => {
  const header = useCollapsibleHeader();
  const insets = useSafeAreaInsets();
  const contentBottomInset = insets.bottom + (hasTabBar ? theme.layout.tabBarClearance : theme.spacing.xl);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground variant={backgroundVariant} />
      {backgroundOverlay}
      <AppScreenHeader
        title={title}
        titleAlign={headerTitleAlign}
        titleSize={headerTitleSize}
        titleMode={headerTitleMode}
        onBack={onBack}
        backAccessibilityLabel={backAccessibilityLabel}
        backIconVariant={backIconVariant}
        action={headerAction}
        scrollY={header.scrollY}
        glassTint={headerGlassTint}
      />
      {children({
        ...header,
        headerContentInset: headerTitleSize === "compact" || headerTitleMode === "scroll"
          ? insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT
          : header.headerContentInset,
        contentBottomInset,
      })}
    </View>
  );
};

export default AppScreenFrame;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.appCanvas },
});
