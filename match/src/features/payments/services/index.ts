import { mockPayoutAccountStore } from "@/src/features/payments/services/MockPayoutAccountStore";
import type { PayoutAccountGateway } from "@/src/features/payments/services/PayoutAccountGateway";

export const payoutAccountGateway: PayoutAccountGateway = mockPayoutAccountStore;
