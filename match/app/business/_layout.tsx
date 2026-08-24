import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { Redirect, Stack } from "expo-router";

export default function BusinessLayout() {
  const { initialized, isAuthenticated, user } = useAuth();

  if (!initialized) return null;
  if (!isAuthenticated) return <Redirect href="/" />;
  if (user?.activeMode !== "venue_manager") return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationTypeForReplace: "push",
        gestureEnabled: true,
        contentStyle: { backgroundColor: theme.colors.black },
      }}
    >
      <Stack.Screen name="setup" options={{ gestureEnabled: false }} />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="settlements" />
      <Stack.Screen name="venues/new" />
      <Stack.Screen name="venues/[venueId]" />
      <Stack.Screen name="reservations/pending" />
      <Stack.Screen name="fields/new" />
      <Stack.Screen
        name="fields/[fieldId]"
        options={{
          animation: "slide_from_bottom",
          presentation: "card",
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="fields/[fieldId]/edit"
        options={{
          animation: "slide_from_bottom",
          presentation: "card",
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="venues/[venueId]/edit"
        options={{
          animation: "slide_from_bottom",
          presentation: "card",
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="fields/[fieldId]/availability"
        options={{
          animation: "slide_from_bottom",
          presentation: "card",
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="reservations/new"
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
          gestureDirection: "vertical",
        }}
      />
    </Stack>
  );
}
