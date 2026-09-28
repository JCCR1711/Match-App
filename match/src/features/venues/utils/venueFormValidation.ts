export type VenueRequiredField = "venueName" | "address" | "district" | "city";

const FIELD_ERROR_MESSAGES: Record<VenueRequiredField, string> = {
  venueName: "Ingresa el nombre de la sede.",
  address: "Ingresa la dirección de la sede.",
  district: "Ingresa el distrito.",
  city: "Ingresa la ciudad.",
};

export const getVenueFieldErrorMessage = (
  field: VenueRequiredField | null,
  expectedField: VenueRequiredField,
) => field === expectedField ? FIELD_ERROR_MESSAGES[expectedField] : null;
