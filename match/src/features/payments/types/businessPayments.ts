export type PaymentStatus = "pending" | "paid" | "failed";

export interface FinancialMovement {
  id: string;
  reservationId: string | null;
  customerName: string;
  dateLabel: string;
  amount: number;
  status: PaymentStatus;
}

export interface Settlement {
  id: string;
  period: string;
  amount: number;
  status: PaymentStatus;
  accountLastDigits: string;
}

export interface PaymentOverview {
  /** Neto cobrado que todavia no forma parte de una liquidacion en proceso. */
  availableBalance: number;
  /** Cobros brutos aprobados durante el mes actual. */
  grossCollectedThisMonth: number;
  /** Comisiones descontadas de los cobros del mes actual. */
  feesThisMonth: number;
}
