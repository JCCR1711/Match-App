import type {
  PayoutAccount,
  PayoutAccountInput,
} from "@/src/features/payments/types/businessPayments";

export interface PayoutAccountGateway {
  get(organizationId: string): Promise<PayoutAccount>;
  save(organizationId: string, input: PayoutAccountInput): Promise<PayoutAccount>;
}
