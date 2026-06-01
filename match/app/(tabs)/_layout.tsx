import { msExplore } from "@material-symbols-react-native/rounded-400/msExplore";
import { msHome } from "@material-symbols-react-native/rounded-400/msHome";
import { Tabs } from "expo-router";
import { MsIcon } from "material-symbols-react-native";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
  const renderIcon = (
    icon: Parameters<typeof MsIcon>[0]["icon"],
    color: string,
    size: number,
  ) => <MsIcon icon={icon} color={color} size={size} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF5A5F",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: [styles.tabBar, Platform.OS === "web" && styles.tabBarWeb],
        tabBarLabelStyle: {
          fontFamily: "Outfit_600SemiBold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => renderIcon(msHome, color, size),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => renderIcon(msExplore, color, size),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E5E5E5",
    borderTopWidth: 1,
    height: 62,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabBarWeb: {
    position: "relative",
  },
});
