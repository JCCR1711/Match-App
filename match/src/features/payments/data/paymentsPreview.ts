import type { FinancialMovement, PaymentOverview, Settlement } from "@/src/features/payments/types/businessPayments";

const GROSS_COLLECTED_THIS_MONTH = 4260;
const FEES_THIS_MONTH = 320;
const PENDING_SETTLEMENT_AMOUNT = 1840;

export const paymentOverview: PaymentOverview = {
  availableBalance: GROSS_COLLECTED_THIS_MONTH - FEES_THIS_MONTH - PENDING_SETTLEMENT_AMOUNT,
  grossCollectedThisMonth: GROSS_COLLECTED_THIS_MONTH,
  feesThisMonth: FEES_THIS_MONTH,
};

export const financialMovements: FinancialMovement[] = [
  { id: "m1", reservationId: "reservation-1", customerName: "Josue", dateLabel: "Hoy", amount: 135, status: "paid" },
  { id: "m2", reservationId: "reservation-2", customerName: "Josue", dateLabel: "Hoy", amount: 120, status: "pending" },
  { id: "m3", reservationId: null, customerName: "Luis Salazar", dateLabel: "07 ago", amount: 75, status: "failed" },
];

export const settlements: Settlement[] = [
  { id: "s1", period: "01 – 07 ago", amount: 1840, status: "pending", accountLastDigits: "456" },
  { id: "s2", period: "25 – 31 jul", amount: 2260, status: "paid", accountLastDigits: "128" },
  { id: "s3", period: "18 – 24 jul", amount: 1620, status: "failed", accountLastDigits: "904" },
];
