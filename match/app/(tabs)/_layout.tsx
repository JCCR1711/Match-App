import AppTabBar from "@/src/components/navigation/AppTabBar";
import CustomIcon from "@/src/components/ui/CustomIcon";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { Calendar03Icon, FootballIcon, Home01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { user } = useAuth();
  const isBusinessMode = user?.activeMode === "venue_manager";

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} mode={isBusinessMode ? "business" : "player"} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.authTextSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", href: isBusinessMode ? null : undefined, tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={Home01Icon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} /> }} />
      <Tabs.Screen name="dashboard" options={{ title: "Inicio", href: isBusinessMode ? undefined : null, tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={Home01Icon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} /> }} />
      <Tabs.Screen name="business-reservations" options={{ title: "Reservas", href: isBusinessMode ? undefined : null, tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={Calendar03Icon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} /> }} />
      <Tabs.Screen name="business-fields" options={{ title: "Sedes", href: isBusinessMode ? undefined : null, tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={FootballIcon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} /> }} />
      <Tabs.Screen name="business-profile" options={{ title: "Perfil", href: isBusinessMode ? undefined : null, tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={UserIcon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} /> }} />
      <Tabs.Screen name="player-reservations" options={{ title: "Mis reservas", href: isBusinessMode ? null : undefined, tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={Calendar03Icon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} /> }} />
      <Tabs.Screen name="player-profile" options={{ title: "Perfil", href: isBusinessMode ? null : undefined, tabBarIcon: ({ color, size, focused }) => <CustomIcon icon={UserIcon} strokeWidth={focused ? 2.6 : 2.2} color={color} size={size} /> }} />
    </Tabs>
  );
}
