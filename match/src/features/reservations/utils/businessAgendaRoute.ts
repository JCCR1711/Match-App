import type { ReservationRecord } from "@/src/features/reservations/types/reservation";

export interface BusinessAgendaRouteParams {
  focusReservationId?: string;
  dateKey?: string;
  fieldId?: string;
  focusStartTime?: string;
}

type SearchParam = string | string[] | undefined;

export interface BusinessAgendaSearchParams {
  focusReservationId?: SearchParam;
  dateKey?: SearchParam;
  fieldId?: SearchParam;
  focusStartTime?: SearchParam;
}

const getFirstParam = (param: SearchParam) => Array.isArray(param) ? param[0] : param;

export const parseBusinessAgendaParams = (
  params: BusinessAgendaSearchParams,
): BusinessAgendaRouteParams => ({
  focusReservationId: getFirstParam(params.focusReservationId),
  dateKey: getFirstParam(params.dateKey),
  fieldId: getFirstParam(params.fieldId),
  focusStartTime: getFirstParam(params.focusStartTime),
});

export const createBusinessAgendaHref = ({
  focusReservationId,
  dateKey,
  fieldId,
  focusStartTime,
}: BusinessAgendaRouteParams) => ({
  pathname: "/(tabs)/business-reservations" as const,
  params: {
    ...(focusReservationId ? { focusReservationId } : {}),
    ...(dateKey ? { dateKey } : {}),
    ...(fieldId ? { fieldId } : {}),
    ...(focusStartTime ? { focusStartTime } : {}),
  },
});

export const createFocusedReservationAgendaHref = (reservation: ReservationRecord) =>
  createBusinessAgendaHref({
    focusReservationId: reservation.id,
    dateKey: reservation.dateKey,
    fieldId: reservation.fieldId,
  });
