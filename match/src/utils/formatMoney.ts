/** Formats monetary values consistently without relying on partial Intl support in Hermes. */
export const formatMoneyAmount = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toFixed(2);
};

export const formatSoles = (value: number) => `S/ ${formatMoneyAmount(value)}`;
