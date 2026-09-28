import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppFeedbackNotice from "@/src/components/ui/AppFeedbackNotice";
import AppTextField from "@/src/components/ui/AppTextField";
import AppUnsavedChangesSheet from "@/src/components/ui/AppUnsavedChangesSheet";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import FinanceAccessNotice from "@/src/features/payments/components/FinanceAccessNotice";
import FinancialInstitutionSelector from "@/src/features/payments/components/FinancialInstitutionSelector";
import { usePayoutAccount } from "@/src/features/payments/hooks/usePayoutAccount";
import { getBusinessFinanceAccess } from "@/src/features/payments/utils/businessFinanceAccess";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";
import BusinessMembershipRestrictedState from "@/src/features/subscriptions/components/BusinessMembershipRestrictedState";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import useUnsavedChangesGuard from "@/src/hooks/useUnsavedChangesGuard";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

const BusinessPayoutAccountEditView = () => {
  const { draft, loading: draftLoading } = useBusinessDraft();
  const { effectiveMembership, effectiveRole, loading: planLoading } = useEffectiveBusinessMembership(draft?.membership);
  const financeAccess = getBusinessFinanceAccess(effectiveRole);
  const { account, loading, saving, error, updateAccount } = usePayoutAccount(draft?.organizationId);
  const [institutionId, setInstitutionId] = useState(account.institutionId);
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [fieldError, setFieldError] = useState<"holder" | "account" | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isLoading = draftLoading || loading || planLoading;
  const hasUnsavedChanges = initialized && (
    institutionId !== account.institutionId
    || holderName.trim() !== account.holderName
    || accountNumber.length > 0
  );
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !saving);
  const returnToAccount = () => backOrReplace("/business/payout-account");

  if (!isLoading && !initialized) {
    setInstitutionId(account.institutionId);
    setHolderName(account.holderName);
    setInitialized(true);
  }

  const save = async () => {
    const normalizedAccount = accountNumber.replace(/\D/g, "");
    if (holderName.trim().length < 3) {
      setFieldError("holder");
      return;
    }
    if (normalizedAccount.length < 10 || normalizedAccount.length > 20) {
      setFieldError("account");
      return;
    }

    Keyboard.dismiss();
    const saved = await updateAccount({ institutionId, holderName: holderName.trim(), accountNumber: normalizedAccount });
    if (saved) unsavedChanges.leaveWithoutPrompt(returnToAccount);
  };

  return (
    <>
      <AppScreenLayout
        title="Cambiar cuenta"
        headerTitleAlign="center"
        headerTitleSize="compact"
        backAccessibilityLabel="Cerrar edición de cuenta"
        backIconVariant="dismiss"
        backgroundVariant={!effectiveMembership.enabled && effectiveMembership.restriction === "team_requires_pro" ? "premium" : "solid"}
        keyboardAware
        contentStyle={styles.content}
        onBack={returnToAccount}
        footer={financeAccess.canManagePayoutAccount && !isLoading ? (
          <CustomButton
            label={saving ? "Guardando..." : "Guardar cuenta"}
            disabled={saving}
            onPress={() => void save()}
            style={styles.saveButton}
          />
        ) : undefined}
      >
        {!isLoading && !effectiveMembership.enabled ? <BusinessMembershipRestrictedState restriction={effectiveMembership.restriction} role={effectiveMembership.originalRole} allowBack /> : null}
        {!isLoading && effectiveMembership.enabled && !financeAccess.canManagePayoutAccount ? <FinanceAccessNotice /> : null}
        {isLoading ? <CustomText text="Cargando..." variant="body" style={styles.muted} /> : financeAccess.canManagePayoutAccount ? (
          <View style={styles.form}>
            <FinancialInstitutionSelector value={institutionId} disabled={saving} onChange={(value) => { setInstitutionId(value); setFieldError(null); }} />
            <AppTextField
              label="Titular"
              value={holderName}
              onChangeText={(value) => { setHolderName(value); setFieldError(null); }}
              placeholder="Nombre registrado en el banco"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              editable={!saving}
              hasError={fieldError === "holder"}
              errorMessage={fieldError === "holder" ? "Ingresa el nombre del titular." : null}
            />
            <AppTextField
              label="Cuenta o CCI"
              value={accountNumber}
              onChangeText={(value) => { setAccountNumber(value.replace(/\D/g, "")); setFieldError(null); }}
              placeholder="Entre 10 y 20 dígitos"
              keyboardType="number-pad"
              returnKeyType="done"
              maxLength={20}
              secureTextEntry
              editable={!saving}
              hasError={fieldError === "account"}
              errorMessage={fieldError === "account" ? "Revisa el número de cuenta o CCI." : null}
              onSubmitEditing={() => void save()}
            />
            <CustomText text="Solo conservaremos la referencia del proveedor y los últimos cuatro dígitos." variant="caption" style={styles.notice} />
            {error ? <AppFeedbackNotice message={error} /> : null}
          </View>
        ) : null}
      </AppScreenLayout>
      <AppUnsavedChangesSheet
        visible={unsavedChanges.confirmationVisible}
        onKeepEditing={unsavedChanges.keepEditing}
        onDiscard={unsavedChanges.discardChanges}
      />
    </>
  );
};

export default BusinessPayoutAccountEditView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.groupGap, paddingBottom: theme.spacing.huge },
  form: { gap: theme.layout.groupGap },
  saveButton: { minHeight: 56, borderRadius: theme.radius.pill },
  muted: { color: theme.colors.authTextSecondary },
  notice: { color: theme.colors.authTextSecondary },
});
