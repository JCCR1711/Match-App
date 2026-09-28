import type { FinancialInstitution } from "@/src/features/payments/types/businessPayments";

export const financialInstitutions: readonly FinancialInstitution[] = [
  { id: "bcp", displayName: "Banco de Crédito del Perú", shortName: "BCP", visualKey: "BCP" },
  { id: "interbank", displayName: "Banco Internacional del Perú", shortName: "Interbank", visualKey: "Interbank" },
  { id: "scotiabank", displayName: "Scotiabank Perú", shortName: "Scotiabank", visualKey: "Scotiabank" },
  { id: "bbva", displayName: "BBVA Perú", shortName: "BBVA", visualKey: "BBVA" },
  { id: "banbif", displayName: "Banco Interamericano de Finanzas", shortName: "BanBif", visualKey: "default" },
  { id: "pichincha", displayName: "Banco Pichincha", shortName: "Pichincha", visualKey: "default" },
  { id: "mibanco", displayName: "Mibanco", shortName: "Mibanco", visualKey: "default" },
  { id: "gnb", displayName: "Banco GNB Perú", shortName: "GNB", visualKey: "default" },
  { id: "falabella", displayName: "Banco Falabella Perú", shortName: "Falabella", visualKey: "default" },
  { id: "ripley", displayName: "Banco Ripley Perú", shortName: "Ripley", visualKey: "default" },
  { id: "comercio", displayName: "Banco de Comercio", shortName: "Comercio", visualKey: "default" },
  { id: "citibank", displayName: "Citibank del Perú", shortName: "Citibank", visualKey: "default" },
  { id: "santander", displayName: "Banco Santander Perú", shortName: "Santander", visualKey: "default" },
  { id: "icbc", displayName: "ICBC Perú Bank", shortName: "ICBC", visualKey: "default" },
  { id: "alfin", displayName: "Alfin Banco", shortName: "Alfin", visualKey: "default" },
  { id: "efectiva", displayName: "Banco Efectiva", shortName: "Efectiva", visualKey: "default" },
  { id: "compartamos", displayName: "Compartamos Banco", shortName: "Compartamos", visualKey: "default" },
  { id: "nacion", displayName: "Banco de la Nación", shortName: "Banco de la Nación", visualKey: "default" },
] as const;

export const getFinancialInstitution = (institutionId: string) =>
  financialInstitutions.find((institution) => institution.id === institutionId) ?? null;

export const findFinancialInstitutionByName = (name: string) => {
  const normalizedName = name.trim().toLocaleLowerCase("es-PE");
  return financialInstitutions.find((institution) =>
    institution.shortName.toLocaleLowerCase("es-PE") === normalizedName
    || institution.displayName.toLocaleLowerCase("es-PE") === normalizedName
  ) ?? null;
};
