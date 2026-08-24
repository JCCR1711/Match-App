/** Formats monetary values consistently without relying on partial Intl support in Hermes. */
export const formatMoneyAmount = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toFixed(2);
};

export const formatMoneyParts = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const [integerPart, fractionPart] = Math.abs(safeValue).toFixed(2).split(".");
  return {
    whole: `${safeValue < 0 ? "-" : ""}${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    decimals: `.${fractionPart}`,
  };
};

export const formatSoles = (value: number) => `S/ ${formatMoneyAmount(value)}`;
