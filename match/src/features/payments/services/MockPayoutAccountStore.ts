import { payoutAccountPreview } from "@/src/features/payments/data/paymentsPreview";
import { findFinancialInstitutionByName, getFinancialInstitution } from "@/src/features/payments/data/financialInstitutions";
import type { PayoutAccount, PayoutAccountInput } from "@/src/features/payments/types/businessPayments";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getStorageKey = (organizationId: string) => `match.mock-payout-account.${organizationId}`;

export class MockPayoutAccountStore {
  async get(organizationId: string): Promise<PayoutAccount> {
    const storedAccount = await AsyncStorage.getItem(getStorageKey(organizationId));
    if (!storedAccount) return payoutAccountPreview;

    try {
      const parsed = JSON.parse(storedAccount) as PayoutAccount & { bank?: string };
      if (parsed.institutionId) return parsed;
      const legacyInstitution = parsed.bank ? findFinancialInstitutionByName(parsed.bank) : null;
      return {
        ...parsed,
        institutionId: legacyInstitution?.id ?? "other",
        institutionName: legacyInstitution?.shortName ?? parsed.bank ?? "Otra entidad",
      };
    } catch {
      await AsyncStorage.removeItem(getStorageKey(organizationId));
      return payoutAccountPreview;
    }
  }

  async save(organizationId: string, input: PayoutAccountInput): Promise<PayoutAccount> {
    const digits = input.accountNumber.replace(/\D/g, "");
    const institution = getFinancialInstitution(input.institutionId);
    const account: PayoutAccount = {
      id: `mock-payout-${Date.now()}`,
      institutionId: input.institutionId,
      institutionName: institution?.shortName ?? "Otra entidad",
      holderName: input.holderName.trim(),
      accountLastDigits: digits.slice(-4),
      currency: "PEN",
      status: "pending_verification",
    };
    await AsyncStorage.setItem(getStorageKey(organizationId), JSON.stringify(account));
    return account;
  }
}

export const mockPayoutAccountStore = new MockPayoutAccountStore();
