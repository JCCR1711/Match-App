import AppBackground, { type AppBackgroundVariant } from "@/src/components/ui/AppBackground";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
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
  children: (layout: AppScreenFrameRenderProps) => ReactNode;
  backgroundVariant?: AppBackgroundVariant;
  onBack?: () => void;
  backAccessibilityLabel?: string;
  headerAction?: ReactNode;
  hasTabBar?: boolean;
}

/** Shared edge-to-edge canvas and collapsible header for scroll and virtualized screens. */
const AppScreenFrame = ({
  title,
  children,
  backgroundVariant = "content",
  onBack,
  backAccessibilityLabel,
  headerAction,
  hasTabBar = false,
}: AppScreenFrameProps) => {
  const header = useCollapsibleHeader();
  const insets = useSafeAreaInsets();
  const contentBottomInset = insets.bottom + (hasTabBar ? theme.layout.tabBarClearance : theme.spacing.xl);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground variant={backgroundVariant} />
      <AppScreenHeader
        title={title}
        onBack={onBack}
        backAccessibilityLabel={backAccessibilityLabel}
        action={headerAction}
        scrollY={header.scrollY}
      />
      {children({ ...header, contentBottomInset })}
    </View>
  );
};

export default AppScreenFrame;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.appCanvas },
});
