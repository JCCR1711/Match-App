import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import DashboardBackground from "@/src/features/dashboard/components/DashboardBackground";
import PaymentStatusLabel from "@/src/features/payments/components/PaymentStatusLabel";
import { settlements } from "@/src/features/payments/data/paymentsPreview";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessSettlementsView = () => {
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <DashboardBackground />
      <AppScreenHeader title="Liquidaciones" onBack={() => router.back()} scrollY={scrollY} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.ScrollView contentContainerStyle={[styles.content, { paddingTop: headerContentInset + theme.spacing.lg }]} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          {settlements.map((settlement) => (
            <AppSurface key={settlement.id} style={styles.card}>
              <View style={styles.heading}>
                <CustomText text={settlement.period} variant="body" style={styles.period} numberOfLines={2} />
                <PaymentStatusLabel status={settlement.status} />
              </View>
              <CustomText text={settlement.amount} variant="body" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} />
              <CustomText text={settlement.destination} variant="caption" style={styles.destination} numberOfLines={2} />
            </AppSurface>
          ))}
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BusinessSettlementsView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.black },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.huge, gap: theme.spacing.lg },
  card: { minHeight: 168, justifyContent: "space-between", padding: theme.spacing.xl, gap: theme.spacing.xl },
  heading: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.lg },
  period: { flex: 1, minWidth: 0, color: theme.colors.white },
  amount: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 29, lineHeight: 36 },
  destination: { color: theme.colors.authTextSecondary },
});
