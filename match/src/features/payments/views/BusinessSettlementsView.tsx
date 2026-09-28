import AppScreenFrame from "@/src/components/ui/AppScreenFrame";
import AppSection from "@/src/components/ui/AppSection";
import CustomText from "@/src/components/ui/CustomText";
import FinanceAccessNotice from "@/src/features/payments/components/FinanceAccessNotice";
import SettlementGradientSurface from "@/src/features/payments/components/SettlementGradientSurface";
import SettlementDetailsSheet from "@/src/features/payments/components/SettlementDetailsSheet";
import SettlementList from "@/src/features/payments/components/SettlementList";
import { settlements } from "@/src/features/payments/data/paymentsPreview";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import { getPendingSettlementAmount } from "@/src/features/payments/utils/settlementSelectors";
import { getBusinessFinanceAccess } from "@/src/features/payments/utils/businessFinanceAccess";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { SCROLL_TITLE_HEADER_HEIGHT } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { formatMoneyParts } from "@/src/utils/formatMoney";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BusinessSettlementsView = () => {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const insets = useSafeAreaInsets();
  const { draft, loading } = useBusinessDraft();
  const { effectiveMembership, effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const financeAccess = getBusinessFinanceAccess(effectiveRole);
  const pendingAmount = getPendingSettlementAmount(settlements);
  const amount = formatMoneyParts(pendingAmount);

  return (
    <>
      <AppScreenFrame
        title="Liquidaciones"
        headerTitleMode="scroll"
        headerGlassTint={`${theme.colors.businessBlueSurface}B8`}
        backgroundVariant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "dashboard"}
        onBack={() => backOrReplace("/business/payments")}
      >
        {({ onScroll, headerContentInset, contentBottomInset }) => financeAccess.canViewSettlements ? (
          <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
            <SettlementGradientSurface
              style={[styles.hero, { paddingTop: insets.top + SCROLL_TITLE_HEADER_HEIGHT + theme.layout.headerContentGap }]}
            >
              <CustomText text="Liquidaciones" variant="heading" style={styles.title} numberOfLines={1} />
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
                <SettlementList settlements={settlements} onPressSettlement={setSelectedSettlement} />
              </AppSection>
            </View>
          </Animated.ScrollView>
        ) : (
          <View style={[styles.restricted, { paddingTop: headerContentInset + theme.spacing.xl, paddingBottom: contentBottomInset }]}>
            {!loading && !planLoading && !effectiveMembership.enabled ? <BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} allowBack /> : null}
            {!loading && !planLoading && effectiveMembership.enabled ? <FinanceAccessNotice /> : null}
          </View>
        )}
      </AppScreenFrame>
      <SettlementDetailsSheet settlement={selectedSettlement} onClose={() => setSelectedSettlement(null)} />
    </>
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
  title: { color: theme.colors.white },
  summary: { minWidth: 0, gap: theme.spacing.xs },
  label: { color: theme.colors.textOnDarkSecondary },
  amountRow: { minWidth: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  currency: { color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  amount: { flexShrink: 1, color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  decimals: { color: theme.colors.textOnDarkSecondary },
  history: {
    minHeight: 1,
    paddingHorizontal: theme.layout.screenGutter,
    paddingTop: theme.layout.groupGap,
    backgroundColor: theme.colors.appCanvas,
  },
  restricted: { flex: 1, paddingHorizontal: theme.layout.screenGutter },
});
