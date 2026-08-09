import CustomIcon from "@/src/components/ui/CustomIcon";
import BusinessTabBar from "@/src/components/navigation/BusinessTabBar";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { Calendar03Icon, FootballIcon, Home01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
  const { user } = useAuth();
  const isBusinessMode = user?.activeMode === "venue_manager";
  return (
    <Tabs
      tabBar={(props) =>
        isBusinessMode ? (
          <BusinessTabBar {...props} />
        ) : (
          <BottomTabBar {...props} />
        )
      }
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.authTextSecondary,
        tabBarStyle: [styles.tabBar, Platform.OS === "web" && styles.tabBarWeb],
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          href: isBusinessMode ? null : undefined,
          tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={Home01Icon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Inicio",
          href: isBusinessMode ? undefined : null,
          tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={Home01Icon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="business-reservations"
        options={{
          title: "Reservas",
          href: isBusinessMode ? undefined : null,
          tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={Calendar03Icon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="business-fields"
        options={{
          title: "Canchas",
          href: isBusinessMode ? undefined : null,
          tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={FootballIcon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="business-profile"
        options={{
          title: "Perfil",
          href: isBusinessMode ? undefined : null,
          tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={UserIcon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(8, 8, 10, 0.98)",
  },
  tabBarItem: { minHeight: 48 },
  tabBarWeb: { position: "relative" },
});
