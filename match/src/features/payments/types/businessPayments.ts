export type PaymentStatus = "pending" | "paid" | "failed";

export interface FinancialMovement {
  id: string;
  customerName: string;
  dateLabel: string;
  amount: number;
  reservationStatus: "confirmed" | "pending" | "canceled";
}

export interface Settlement {
  id: string;
  period: string;
  amount: number;
  status: PaymentStatus;
  accountLastDigits: string;
}

export interface PaymentOverview {
  availableBalance: number;
  collectedThisMonth: number;
  feesThisMonth: number;
}
