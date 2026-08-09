import CustomText from "@/src/components/ui/CustomText";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import VenueSetupBackground from "@/src/features/venues/components/VenueSetupBackground";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessReservationsView = () => {
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();

  return (
    <View style={styles.root}>
    <StatusBar style="light" />
    <VenueSetupBackground />
    <AppScreenHeader title="Reservas" scrollY={scrollY} />
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <Animated.ScrollView
        contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.md }]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.emptyState}>
          <CustomText text="Aún no hay reservas" variant="body" style={styles.emptyTitle} />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
    </View>
  );
};

export default BusinessReservationsView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.huge * 2 + theme.spacing.lg, gap: theme.spacing.xxxl },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing.xs },
  emptyTitle: { color: theme.colors.authText },
});
