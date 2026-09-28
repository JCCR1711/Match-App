import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppScreenState from "@/src/components/ui/AppScreenState";
import AppSection from "@/src/components/ui/AppSection";
import AppRoleNotice from "@/src/components/ui/AppRoleNotice";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import FinanceAccessNotice from "@/src/features/payments/components/FinanceAccessNotice";
import PayoutAccountCard from "@/src/features/payments/components/PayoutAccountCard";
import PayoutAccountSkeleton from "@/src/features/payments/components/PayoutAccountSkeleton";
import { usePayoutAccount } from "@/src/features/payments/hooks/usePayoutAccount";
import { getBusinessFinanceAccess } from "@/src/features/payments/utils/businessFinanceAccess";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

const BusinessPayoutAccountView = () => {
  const { draft, loading: draftLoading } = useBusinessDraft();
  const { effectiveMembership, effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const financeAccess = getBusinessFinanceAccess(effectiveRole);
  const { account, loading, error, reload } = usePayoutAccount(draft?.organizationId);
  const isLoading = draftLoading || loading || planLoading;

  return (
    <AppScreenLayout
        title="Cuenta de depósito"
        headerTitleMode="scroll"
        backgroundVariant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "dashboard"}
        onBack={() => backOrReplace("/business/payments")}
        contentStyle={styles.content}
        footer={financeAccess.canManagePayoutAccount && !isLoading ? (
          <CustomButton label="Cambiar cuenta" variant="light" onPress={() => router.push("/business/payout-account/edit")} accessibilityLabel="Cambiar cuenta de depósito" style={styles.changeAccountButton} />
        ) : undefined}
      >
        {!isLoading && !effectiveMembership.enabled ? <BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} allowBack /> : null}
        {!isLoading && effectiveMembership.enabled && !financeAccess.canViewFinances ? <FinanceAccessNotice /> : null}
        {isLoading ? (
          <PayoutAccountSkeleton />
        ) : error ? (
          <AppScreenState
            title="No pudimos cargar la cuenta"
            message={error}
            actionLabel="Intentarlo de nuevo"
            onAction={() => void reload()}
            style={styles.screenState}
          />
        ) : financeAccess.canViewFinances ? (
          <>
            <PayoutAccountCard account={account} />
            <AppSection title="Información bancaria">
              <View style={styles.details}>
                <Detail label="Titular" value={account.holderName} />
                <Detail label="Moneda" value="Soles (PEN)" last />
              </View>
            </AppSection>
            {!financeAccess.canManagePayoutAccount ? (
              <AppRoleNotice message="Solo el propietario puede reemplazar la cuenta de depósito." />
            ) : null}
          </>
        ) : null}
    </AppScreenLayout>
  );
};

const Detail = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <View style={[styles.detail, !last && styles.detailBorder]}>
    <CustomText text={label} variant="body" style={styles.detailLabel} />
    <CustomText text={value} variant="bodyStrong" style={styles.detailValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} />
  </View>
);

export default BusinessPayoutAccountView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.groupGap },
  screenState: { minHeight: 420, paddingHorizontal: 0 },
  changeAccountButton: { borderRadius: theme.radius.pill },
  details: { gap: 0 },
  detail: { minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.lg },
  detailBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.separatorOnDark },
  detailLabel: { color: theme.colors.authTextSecondary },
  detailValue: { flex: 1, minWidth: 0, color: theme.colors.white, textAlign: "right" },
});
