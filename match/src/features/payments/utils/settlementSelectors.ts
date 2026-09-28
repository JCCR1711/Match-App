import type { Settlement } from "@/src/features/payments/types/businessPayments";

export const getNextPendingSettlement = (
  settlements: readonly Settlement[],
) => settlements.find((settlement) => settlement.status === "scheduled" || settlement.status === "processing") ?? null;

export const getPendingSettlementAmount = (
  settlements: readonly Settlement[],
) => settlements.reduce(
  (total, settlement) => settlement.status === "scheduled" || settlement.status === "processing" ? total + settlement.netAmount : total,
  0,
);

export const getPendingSettlements = (
  settlements: readonly Settlement[],
) => settlements.filter((settlement) => settlement.status === "scheduled" || settlement.status === "processing");
