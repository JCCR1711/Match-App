import type { FinancialMovement, PaymentOverview, PayoutAccount, Settlement } from "@/src/features/payments/types/businessPayments";

const GROSS_COLLECTED_THIS_MONTH = 4260;
const FEES_THIS_MONTH = 320;
const PROCESSING_SETTLEMENT_AMOUNT = 1840;

export const paymentOverview: PaymentOverview = {
  unsettledBalance: GROSS_COLLECTED_THIS_MONTH - FEES_THIS_MONTH - PROCESSING_SETTLEMENT_AMOUNT,
  grossCollectedThisMonth: GROSS_COLLECTED_THIS_MONTH,
  feesThisMonth: FEES_THIS_MONTH,
  netCollectedThisMonth: GROSS_COLLECTED_THIS_MONTH - FEES_THIS_MONTH,
};

export const payoutAccountPreview: PayoutAccount = {
  id: "payout-account-demo-1",
  institutionId: "bcp",
  institutionName: "BCP",
  holderName: "Match Arena SAC",
  accountLastDigits: "0456",
  currency: "PEN",
  status: "verified",
};

export const financialMovements: FinancialMovement[] = [
  { id: "m1", reservationId: "reservation-1", kind: "charge", customerName: "Josue", dateLabel: "Hoy", grossAmount: 135, feeAmount: 10, netAmount: 125, status: "paid" },
  { id: "m2", reservationId: "reservation-2", kind: "charge", customerName: "Josue", dateLabel: "Hoy", grossAmount: 120, feeAmount: 9, netAmount: 111, status: "processing" },
  { id: "m3", reservationId: null, kind: "charge", customerName: "Luis Salazar", dateLabel: "07 ago", grossAmount: 75, feeAmount: 0, netAmount: 0, status: "failed" },
];

export const settlements: Settlement[] = [
  { id: "s1", period: "01 - 07 ago", grossAmount: 1980, feeAmount: 140, adjustmentAmount: 0, netAmount: 1840, reservationCount: 16, status: "processing", accountLastDigits: "456", expectedDepositLabel: "12 ago", depositedAtLabel: null },
  { id: "s2", period: "25 - 31 jul", grossAmount: 2440, feeAmount: 180, adjustmentAmount: 0, netAmount: 2260, reservationCount: 19, status: "deposited", accountLastDigits: "128", expectedDepositLabel: "05 ago", depositedAtLabel: "05 ago" },
  { id: "s3", period: "18 - 24 jul", grossAmount: 1770, feeAmount: 125, adjustmentAmount: -25, netAmount: 1620, reservationCount: 14, status: "failed", accountLastDigits: "904", expectedDepositLabel: "29 jul", depositedAtLabel: null },
];
