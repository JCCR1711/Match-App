import type { FinancialMovement, Settlement } from "@/src/features/payments/types/businessPayments";

export const financialMovements: FinancialMovement[] = [
  { id: "m1", title: "Reserva confirmada", detail: "Cancha principal · 08 ago", amount: "+ S/ 120", status: "paid" },
  { id: "m2", title: "Pago por confirmar", detail: "Cancha 2 · 08 ago", amount: "+ S/ 90", status: "pending" },
  { id: "m3", title: "Pago rechazado", detail: "Cancha norte · 07 ago", amount: "S/ 75", status: "failed" },
];

export const settlements: Settlement[] = [
  { id: "s1", period: "01 – 07 ago", amount: "S/ 1,840", status: "pending", destination: "Cuenta terminada en 4281" },
  { id: "s2", period: "25 – 31 jul", amount: "S/ 2,260", status: "paid", destination: "Depositado el 02 ago" },
  { id: "s3", period: "18 – 24 jul", amount: "S/ 1,620", status: "failed", destination: "Revisa tu cuenta bancaria" },
];
