import { AuthProvider } from "@/src/context/AuthProvider";
import DeviceLocationProvider from "@/src/context/DeviceLocationProvider";
import AuthNavigationGuard from "@/src/features/auth/components/AuthNavigationGuard";
import { OnboardingProvider } from "@/src/features/auth/context/OnboardingProvider";
import { authGateway } from "@/src/features/auth/services";
import LaunchSplash from "@/src/features/launch/components/LaunchSplash";
import { sessionStore } from "@/src/services/storage";
import { theme } from "@/src/theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();
void SystemUI.setBackgroundColorAsync(theme.colors.appCanvas);

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
    <GestureHandlerRootView style={styles.root}>
    <KeyboardProvider>
    <DeviceLocationProvider>
    <AuthProvider gateway={authGateway} sessionStore={sessionStore}>
      <OnboardingProvider>
      <StatusBar style="dark" />
      <AuthNavigationGuard>
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
            animation: "slide_from_bottom",
            presentation: "card",
            gestureEnabled: true,
            gestureDirection: "vertical",
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/fields/[fieldId]/edit"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/venues/[venueId]/edit"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/reservations/new"
          options={{
            animation: "slide_from_bottom",
            presentation: "modal",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="business/fields/[fieldId]/availability"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="venues/[venueId]"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="reservations/new"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        <Stack.Screen
          name="reservations/confirmation"
          options={{
            animation: "fade",
            gestureEnabled: false,
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
        <Stack.Screen
          name="profile/avatar"
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            contentStyle: { backgroundColor: theme.colors.black },
          }}
        />
        </Stack>
      </AuthNavigationGuard>
      {showLaunchSplash ? (
        <LaunchSplash onComplete={handleLaunchComplete} />
      ) : null}
      </OnboardingProvider>
    </AuthProvider>
    </DeviceLocationProvider>
    </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
