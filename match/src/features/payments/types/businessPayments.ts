export type PaymentStatus = "pending" | "paid" | "failed";

export interface FinancialMovement {
  id: string;
  title: string;
  detail: string;
  amount: string;
  status: PaymentStatus;
}

export interface Settlement {
  id: string;
  period: string;
  amount: string;
  status: PaymentStatus;
  destination: string;
}
