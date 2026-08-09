import { AuthProvider } from "@/src/context/AuthProvider";
import { authGateway } from "@/src/features/auth/services";
import LaunchSplash from "@/src/features/launch/components/LaunchSplash";
import { sessionStore } from "@/src/services/storage";
import { theme } from "@/src/theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showLaunchSplash, setShowLaunchSplash] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    Outfit_600SemiBold: require("../src/assets/fonts/Outfit-SemiBold.ttf"),
    Poppins_700Bold: require("../src/assets/fonts/Poppins-Bold.ttf"),
  });

  const handleLaunchComplete = useCallback(() => {
    setShowLaunchSplash(false);
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider gateway={authGateway} sessionStore={sessionStore}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="auth/welcome"
          options={{
            animation: "ios_from_right",
            presentation: "card",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="auth/email"
          options={{
            animation: "ios_from_right",
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="auth/verify-email"
          options={{
            animation: "ios_from_right",
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="auth/complete-profile"
          options={{
            animation: "ios_from_right",
            gestureEnabled: false,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="auth/select-mode"
          options={{
            animation: "ios_from_right",
            gestureEnabled: false,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/setup"
          options={{
            animation: "ios_from_right",
            gestureEnabled: false,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/venues/new"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/venues/[venueId]"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/fields/new"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/fields/[fieldId]"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/availability"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="legal/terms-and-privacy"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
      </Stack>
      {showLaunchSplash ? (
        <LaunchSplash onComplete={handleLaunchComplete} />
      ) : null}
    </AuthProvider>
  );
}
