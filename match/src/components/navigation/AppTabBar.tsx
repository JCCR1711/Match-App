import CustomIcon from "@/src/components/ui/CustomIcon";
import GlassSurface from "@/src/components/ui/GlassSurface";
import { theme } from "@/src/theme";
import { Calendar03Icon, FootballIcon, Home01Icon, UserIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppTabBarMode = "business" | "player";

const TAB_ROUTES: Record<AppTabBarMode, readonly string[]> = {
  business: ["dashboard", "business-reservations", "business-fields", "business-profile"],
  player: ["index", "player-reservations", "player-profile"],
};

const TAB_ICONS: Record<AppTabBarMode, Record<string, IconSvgElement>> = {
  business: {
    dashboard: Home01Icon,
    "business-reservations": Calendar03Icon,
    "business-fields": FootballIcon,
    "business-profile": UserIcon,
  },
  player: {
    index: Home01Icon,
    "player-reservations": Calendar03Icon,
    "player-profile": UserIcon,
  },
};

interface AppTabBarProps extends BottomTabBarProps {
  mode: AppTabBarMode;
}

const AppTabBar = ({ state, descriptors, navigation, mode }: AppTabBarProps) => {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter((route) => TAB_ROUTES[mode].includes(route.name));

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <GlassSurface intensity={62} fallbackTint="rgba(8, 8, 10, 0.3)" interactive style={styles.navigationPill}>
        {routes.map((route) => {
          const routeIndex = state.routes.findIndex((item) => item.key === route.key);
          const focused = state.index === routeIndex;
          const options = descriptors[route.key].options;
          const label = typeof options.title === "string" ? options.title : route.name;
          const TabIcon = TAB_ICONS[mode][route.name];

          const handlePress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={handlePress}
              onLongPress={() => navigation.emit({ type: "tabLongPress", target: route.key })}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <CustomIcon icon={TabIcon} color={focused ? theme.colors.white : theme.colors.authTextSecondary} sizeToken="large" strokeWidth={focused ? 2.6 : 2.2} />
            </Pressable>
          );
        })}
      </GlassSurface>
    </View>
  );
};

export default AppTabBar;

const styles = StyleSheet.create({
  wrapper: { position: "absolute", left: theme.spacing.xxl, right: theme.spacing.xxl, bottom: 0, flexDirection: "row", alignItems: "center" },
  navigationPill: { flex: 1, height: 58, flexDirection: "row", alignItems: "center", padding: 5, borderRadius: theme.radius.pill, borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(255, 255, 255, 0.16)", backgroundColor: "transparent", overflow: "hidden", shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 18, elevation: 12 },
  tab: { flex: 1, height: 48, borderRadius: theme.radius.pill, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.96 }] },
});
