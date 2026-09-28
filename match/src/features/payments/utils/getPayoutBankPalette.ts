import { theme } from "@/src/theme";

export interface PayoutBankPalette {
  gradient: readonly [string, string, string];
  accent: string;
  onAccent: string;
}

const supportedPalettes: Readonly<Record<string, PayoutBankPalette>> = theme.payoutBankPalettes;

/** Resolves known bank branding without allowing an unknown backend value to break rendering. */
export const getPayoutBankPalette = (bank: string): PayoutBankPalette =>
  supportedPalettes[bank] ?? theme.payoutBankFallbackPalette;
