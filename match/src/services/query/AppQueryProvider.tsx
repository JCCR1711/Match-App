import { appQueryClient } from "@/src/services/query/queryClient";
import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { AppState, Platform, type AppStateStatus } from "react-native";

const handleAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== "web") focusManager.setFocused(status === "active");
};

const AppQueryProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={appQueryClient}>{children}</QueryClientProvider>;
};

export default AppQueryProvider;
