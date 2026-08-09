import CustomText from "@/src/components/ui/CustomText";
import GlassHeader from "@/src/components/ui/GlassHeader";
import BusinessDashboardOverview from "@/src/features/dashboard/components/BusinessDashboardOverview";
import type { BusinessSetupKind } from "@/src/features/dashboard/components/BusinessSetupCard";
import BusinessSetupCard from "@/src/features/dashboard/components/BusinessSetupCard";
import DashboardBackground from "@/src/features/dashboard/components/DashboardBackground";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedCustomText = Animated.createAnimatedComponent(CustomText);

const DashboardView = () => {
  const { draft, loading, error } = useBusinessDraft();
  const insets = useSafeAreaInsets();
  const businessName = draft?.businessName || "Match Arena";
  const venues = draft?.venues ?? [];
  const fields = draft?.fields ?? [];
  const pendingField = fields.find((field) => !field.availability);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerShellStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, 104],
      [insets.top + 112, insets.top + 64],
      Extrapolation.CLAMP,
    ),
  }));

  const greetingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 78], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, 90],
          [0, -18],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const businessNameStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollY.value,
      [0, 104],
      [theme.colors.textSecondary, theme.colors.white],
    ),
  }));

  const handleSetup = () => {
    if (venues.length === 0) {
      router.push("/business/venues/new");
      return;
    }
    if (fields.length === 0) {
      router.push("/business/fields/new");
      return;
    }
    if (pendingField) {
      router.push({
        pathname: "/business/availability",
        params: { fieldId: pendingField.fieldId },
      });
      return;
    }
    router.navigate("/(tabs)/business-fields");
  };

  const setupAction: {
    kind: BusinessSetupKind;
    title: string;
    accessibilityLabel: string;
  } = pendingField
    ? {
        kind: "availability",
        title: "Abre tu agenda",
        accessibilityLabel: "Configurar disponibilidad",
      }
    : venues.length > 0
      ? {
          kind: "field",
          title: "Agrega tu cancha",
          accessibilityLabel: "Agregar cancha",
        }
      : {
          kind: "venue",
          title: "Crea tu primera sede",
          accessibilityLabel: "Agregar sede",
        };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <DashboardBackground />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.headerShell,
          { height: insets.top + 112 },
          headerShellStyle,
        ]}
      >
        <GlassHeader topInset={insets.top} contentHeight={112}>
          <View style={styles.headerCopy}>
            <View style={styles.businessNameSlot}>
              <AnimatedCustomText
                text={businessName.toLocaleUpperCase()}
                variant="caption"
                style={[styles.businessName, businessNameStyle]}
                numberOfLines={1}
              />
            </View>
            <Animated.View style={[styles.greetingSlot, greetingStyle]}>
              <CustomText
                text="Bienvenido"
                variant="body"
                style={styles.greeting}
                numberOfLines={1}
              />
            </Animated.View>
          </View>
        </GlassHeader>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 112 + theme.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {loading ? (
          <CustomText
            text="Preparando tu inicio"
            variant="body"
            style={styles.centeredMessage}
          />
        ) : error ? (
          <CustomText
            text={error}
            variant="body"
            style={styles.centeredMessage}
            accessibilityRole="alert"
          />
        ) : draft ? (
          <View style={styles.content}>
            {venues.length === 0 || fields.length === 0 || pendingField ? (
              <BusinessSetupCard
                kind={setupAction.kind}
                title={setupAction.title}
                onPress={handleSetup}
                accessibilityLabel={setupAction.accessibilityLabel}
              />
            ) : null}

            {venues.length > 0 ? (
              <BusinessDashboardOverview
                draft={draft}
                onOpenReservations={() =>
                  router.navigate("/(tabs)/business-reservations")
                }
                onOpenFields={() => router.navigate("/(tabs)/business-fields")}
                onOpenAnalytics={() => router.push("/business/analytics")}
                onOpenPayments={() => router.push("/business/payments")}
                onOpenField={(fieldId) =>
                  router.push({
                    pathname: "/business/fields/[fieldId]",
                    params: { fieldId },
                  })
                }
              />
            ) : null}
          </View>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
};

export default DashboardView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  headerShell: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
    overflow: "hidden",
  },
  headerCopy: {
    flex: 1,
    maxWidth: "76%",
  },
  businessNameSlot: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 64,
    justifyContent: "center",
  },
  businessName: {
    letterSpacing: 1.15,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontWeight: theme.fontWeights.bold,
  },
  greetingSlot: {
    position: "absolute",
    top: 60,
    right: 0,
    left: 0,
  },
  greeting: {
    color: theme.colors.authText,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: -0.35,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.huge * 2 + theme.spacing.lg,
  },
  centeredMessage: {
    marginVertical: "auto",
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  content: {
    flex: 1,
    gap: theme.spacing.xxxl,
  },
});
