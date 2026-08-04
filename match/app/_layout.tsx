import { AuthProvider } from "@/src/context/AuthProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_300Light:
      "https://fonts.gstatic.com/s/outfit/v11/QGY_z_wNPok7K0_MxGj-UXtE4KxYqg.ttf",
    Outfit_400Regular:
      "https://fonts.gstatic.com/s/outfit/v11/QGY_z_wNPok7K0_MxGj-U3tA4KxYqg.ttf",
    Outfit_500Medium:
      "https://fonts.gstatic.com/s/outfit/v11/QGY_z_wNPok7K0_MxGj-UUtA4KxYqg.ttf",
    Outfit_600SemiBold:
      "https://fonts.gstatic.com/s/outfit/v11/QGY_z_wNPok7K0_MxGj-UQtA4KxYqg.ttf",
    Outfit_700Bold:
      "https://fonts.gstatic.com/s/outfit/v11/QGY_z_wNPok7K0_MxGj-UctA4KxYqg.ttf",
    Outfit_800ExtraBold:
      "https://fonts.gstatic.com/s/outfit/v11/QGY_z_wNPok7K0_MxGj-UMtA4KxYqg.ttf",
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
