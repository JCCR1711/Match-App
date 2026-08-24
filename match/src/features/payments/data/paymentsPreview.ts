import type { FinancialMovement, PaymentOverview, Settlement } from "@/src/features/payments/types/businessPayments";

export const paymentOverview: PaymentOverview = {
  availableBalance: 3940,
  collectedThisMonth: 4260,
  feesThisMonth: 320,
};

export const financialMovements: FinancialMovement[] = [
  { id: "m1", customerName: "Diego Ramos", dateLabel: "08 ago", amount: 120, reservationStatus: "confirmed" },
  { id: "m2", customerName: "Marco Ruiz", dateLabel: "08 ago", amount: 90, reservationStatus: "pending" },
  { id: "m3", customerName: "Luis Salazar", dateLabel: "07 ago", amount: 75, reservationStatus: "canceled" },
];

export const settlements: Settlement[] = [
  { id: "s1", period: "01 – 07 ago", amount: 1840, status: "pending", accountLastDigits: "456" },
  { id: "s2", period: "25 – 31 jul", amount: 2260, status: "paid", accountLastDigits: "128" },
  { id: "s3", period: "18 – 24 jul", amount: 1620, status: "failed", accountLastDigits: "904" },
];
