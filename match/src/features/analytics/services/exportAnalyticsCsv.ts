import type { ReservationPaymentStatus, ReservationRecord, ReservationStatus } from "@/src/features/reservations/types/reservation";
import { addMinutesToTime } from "@/src/features/reservations/utils/reservationTime";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

interface AnalyticsCsvReport {
  reservations: readonly ReservationRecord[];
  businessName: string;
  periodLabel: string;
  scopeLabel: string;
  generatedAt?: Date;
}

const reservationStatusLabels: Record<ReservationStatus, string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  canceled: "Cancelada",
};

const paymentStatusLabels: Record<ReservationPaymentStatus, string> = {
  pending: "Pago pendiente",
  paid: "Pagado en MATCH",
  pay_at_venue: "Cobro en sede",
  refund_pending: "Devolución pendiente",
  refunded: "Devuelto",
};

const sanitizeSpreadsheetValue = (value: string) => /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
const quoteCsv = (value: string | number) => {
  const safeValue = typeof value === "number" ? String(value) : sanitizeSpreadsheetValue(value);
  return `"${safeValue.replaceAll('"', '""')}"`;
};
const csvRow = (values: readonly (string | number)[]) => values.map(quoteCsv).join(",");

const formatDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-");
  return year && month && day ? `${day}/${month}/${year}` : dateKey;
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return [hours ? `${hours} h` : null, remainingMinutes ? `${remainingMinutes} min` : null].filter(Boolean).join(" ") || "0 min";
};

export const buildAnalyticsCsv = ({ reservations, businessName, periodLabel, scopeLabel, generatedAt = new Date() }: AnalyticsCsvReport) => {
  const orderedReservations = [...reservations].sort((first, second) => `${first.dateKey}-${first.startTime}`.localeCompare(`${second.dateKey}-${second.startTime}`));
  const generatedLabel = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(generatedAt);
  const metadata = [
    ["MATCH", "Reporte de estadísticas"],
    ["Negocio", businessName],
    ["Periodo", periodLabel],
    ["Alcance", scopeLabel],
    ["Generado", generatedLabel],
    ["Reservas incluidas", orderedReservations.length],
    [],
  ];
  const header = ["Código MATCH", "Fecha", "Inicio", "Fin", "Duración", "Sede", "Cancha", "Cliente", "Canal", "Estado de reserva", "Estado de cobro", "Importe (PEN)"];
  const rows = orderedReservations.map((item) => [
    item.referenceCode,
    formatDate(item.dateKey),
    item.startTime,
    addMinutesToTime(item.startTime, item.durationMinutes),
    formatDuration(item.durationMinutes),
    item.venueName,
    item.fieldName,
    item.customerDisplayName,
    item.source === "match" ? "MATCH" : "Local",
    reservationStatusLabels[item.status],
    paymentStatusLabels[item.paymentStatus],
    item.amount,
  ]);
  return `\uFEFF${[...metadata, header, ...rows].map(csvRow).join("\r\n")}`;
};

export const exportAnalyticsCsv = async (report: AnalyticsCsvReport, filename: string) => {
  const csv = buildAnalyticsCsv(report);
  if (Platform.OS === "web") {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
    return;
  }

  if (!await Sharing.isAvailableAsync()) throw new Error("La exportación no está disponible en este dispositivo.");
  const file = new File(Paths.cache, filename);
  file.write(csv);
  await Sharing.shareAsync(file.uri, {
    dialogTitle: "Exportar estadísticas de MATCH",
    mimeType: "text/csv",
    UTI: "public.comma-separated-values-text",
  });
};
