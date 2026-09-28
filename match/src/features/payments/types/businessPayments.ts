export type PaymentStatus = "processing" | "paid" | "failed" | "refunded";
export type FinancialMovementKind = "charge" | "refund" | "adjustment";
export type SettlementStatus = "scheduled" | "processing" | "deposited" | "failed";
export type PayoutAccountStatus = "verified" | "pending_verification";
export type PayoutBankVisualKey = "BCP" | "BBVA" | "Interbank" | "Scotiabank" | "default";

export interface FinancialInstitution {
  id: string;
  displayName: string;
  shortName: string;
  visualKey: PayoutBankVisualKey;
}

export interface PayoutAccount {
  id: string;
  institutionId: string;
  institutionName: string;
  holderName: string;
  accountLastDigits: string;
  currency: "PEN";
  status: PayoutAccountStatus;
}

export interface PayoutAccountInput {
  institutionId: string;
  holderName: string;
  accountNumber: string;
}

export interface FinancialMovement {
  id: string;
  reservationId: string | null;
  kind: FinancialMovementKind;
  customerName: string;
  dateLabel: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: PaymentStatus;
}

export interface Settlement {
  id: string;
  period: string;
  grossAmount: number;
  feeAmount: number;
  adjustmentAmount: number;
  netAmount: number;
  reservationCount: number;
  status: SettlementStatus;
  accountLastDigits: string;
  expectedDepositLabel: string;
  depositedAtLabel: string | null;
}

export interface PaymentOverview {
  /** Neto cobrado que todavia no forma parte de una liquidacion en proceso. */
  unsettledBalance: number;
  /** Cobros brutos aprobados durante el mes actual. */
  grossCollectedThisMonth: number;
  /** Comisiones descontadas de los cobros del mes actual. */
  feesThisMonth: number;
  /** Neto aprobado despues de comisiones durante el mes actual. */
  netCollectedThisMonth: number;
}
