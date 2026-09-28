import { createContext } from "react";

export type AppToastTone = "error" | "success" | "info";
export type AppToastPlacement = "top" | "bottom";
export type AppToastPresentation = "standard" | "compactBanner";

export interface ShowAppToastInput {
  message: string;
  title?: string;
  tone?: AppToastTone;
  placement?: AppToastPlacement;
  presentation?: AppToastPresentation;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export interface AppToastContextValue {
  showToast: (input: ShowAppToastInput) => void;
  dismissToast: () => void;
}

const AppToastContext = createContext<AppToastContextValue | undefined>(undefined);

export default AppToastContext;
