import { useAuth } from "@/src/hooks/useAuth";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import { theme } from "@/src/theme";
import { Redirect, Stack, usePathname } from "expo-router";

export default function BusinessLayout() {
  const { initialized, isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const { draft, loading: draftLoading } = useBusinessDraft({ redirectWhenMissing: false });
  const { effectiveMembership, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);

  if (!initialized) return null;
  if (!isAuthenticated) return <Redirect href="/" />;
  if (user?.activeMode !== "venue_manager") return <Redirect href="/(tabs)" />;
  if (draftLoading || planLoading) return null;
  const subscriptionRoute = pathname === "/business/plan" || pathname === "/business/access-required";
  if (draft && !effectiveMembership.enabled && !subscriptionRoute) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

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
      <Stack.Screen name="online-reservations" />
      <Stack.Screen
        name="access-required"
        options={{ animation: "slide_from_bottom", presentation: "modal", gestureEnabled: false }}
      />
      <Stack.Screen
        name="plan"
        options={{
          animation: "slide_from_right",
          presentation: "card",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="payments" />
      <Stack.Screen name="payout-account" />
      <Stack.Screen
        name="payout-account/edit"
        options={{
          animation: "slide_from_bottom",
          presentation: "card",
          gestureDirection: "vertical",
        }}
      />
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
