import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import AppSection from "@/src/components/ui/AppSection";
import CustomText from "@/src/components/ui/CustomText";
import SettlementGradientSurface from "@/src/features/payments/components/SettlementGradientSurface";
import SettlementList from "@/src/features/payments/components/SettlementList";
import { settlements } from "@/src/features/payments/data/paymentsPreview";
import { COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { formatMoneyParts } from "@/src/utils/formatMoney";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BusinessSettlementsView = () => {
  const insets = useSafeAreaInsets();
  const pendingAmount = settlements
    .filter((settlement) => settlement.status === "pending")
    .reduce((total, settlement) => total + settlement.amount, 0);
  const amount = formatMoneyParts(pendingAmount);

  return (
    <AppScreenFrame
      title="Liquidaciones"
      headerTitleMode="scroll"
      headerGlassTint={`${theme.colors.businessBlueSurface}F2`}
      backgroundVariant="dashboard"
      onBack={() => router.back()}
    >
      {({ onScroll, contentBottomInset }) => (
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <SettlementGradientSurface
            style={[styles.hero, { paddingTop: insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT + theme.spacing.sm }]}
          >
            <CustomText text="Liquidaciones" variant="body" style={styles.title} numberOfLines={1} />
            <View style={styles.summary}>
              <CustomText text="En proceso" variant="caption" style={styles.label} />
              <View style={styles.amountRow}>
                <CustomText text="S/" variant="display" style={styles.currency} />
                <CustomText text={amount.whole} variant="display" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} />
                <CustomText text={amount.decimals} variant="subtitle" style={styles.decimals} />
              </View>
            </View>
          </SettlementGradientSurface>

          <View style={[styles.history, { paddingBottom: contentBottomInset }]}>
            <AppSection title="Historial">
              <SettlementList settlements={settlements} />
            </AppSection>
          </View>
        </Animated.ScrollView>
      )}
    </AppScreenFrame>
  );
};

export default BusinessSettlementsView;

const styles = StyleSheet.create({
  hero: {
    gap: theme.spacing.xl,
    paddingHorizontal: theme.layout.screenGutter,
    paddingBottom: theme.spacing.xxl,
    borderRadius: theme.radius.sheet,
    borderCurve: "continuous",
  },
  title: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: -0.35,
  },
  summary: { minWidth: 0, gap: theme.spacing.xs },
  label: { color: theme.colors.textOnDarkSecondary },
  amountRow: { minWidth: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  currency: { color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  amount: { flexShrink: 1, color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  decimals: { color: theme.colors.textOnDarkSecondary },
  history: {
    minHeight: 1,
    paddingHorizontal: theme.layout.screenGutter,
    paddingTop: theme.layout.sectionGap,
    backgroundColor: theme.colors.appCanvas,
  },
});
