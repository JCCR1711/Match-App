export interface BusinessReservationCreateRouteParams extends Record<string, string> {
  venueId: string;
  venueName: string;
  fieldId: string;
  fieldName: string;
  dateKey: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  hourlyPrice: string;
}

type SearchParam = string | string[] | undefined;

type BusinessReservationCreateSearchParams = {
  [Key in keyof BusinessReservationCreateRouteParams]?: SearchParam;
};

const getFirstParam = (param: SearchParam) => Array.isArray(param) ? param[0] : param;

export const parseBusinessReservationCreateParams = (
  params: BusinessReservationCreateSearchParams,
): Partial<BusinessReservationCreateRouteParams> => ({
  venueId: getFirstParam(params.venueId),
  venueName: getFirstParam(params.venueName),
  fieldId: getFirstParam(params.fieldId),
  fieldName: getFirstParam(params.fieldName),
  dateKey: getFirstParam(params.dateKey),
  dateLabel: getFirstParam(params.dateLabel),
  startTime: getFirstParam(params.startTime),
  endTime: getFirstParam(params.endTime),
  hourlyPrice: getFirstParam(params.hourlyPrice),
});

export const createBusinessReservationHref = (
  params: BusinessReservationCreateRouteParams,
) => ({
  pathname: "/business/reservations/new" as const,
  params,
});
