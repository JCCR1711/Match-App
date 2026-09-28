import { businessDraftQueryKeys } from "@/src/features/venues/queries/businessDraftQueryKeys";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { BusinessOnboardingDraft } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";

interface UseBusinessDraftOptions {
  redirectWhenMissing?: boolean;
  enabled?: boolean;
}

export const useBusinessDraft = ({
  redirectWhenMissing = true,
  enabled = true,
}: UseBusinessDraftOptions = {}) => {
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient();
  const accountId = user?.id ?? "anonymous";
  const queryKey = businessDraftQueryKeys.byAccount(accountId);
  const canLoad = enabled && Boolean(accessToken && user);
  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!accessToken) throw new Error("Tu sesión expiró.");
      return venueOnboardingGateway.getBusinessDraft(accessToken);
    },
    enabled: canLoad,
  });
  const { refetch } = query;

  useEffect(() => {
    if (!enabled) return;
    if (!accessToken && user) {
      router.replace("/");
      return;
    }
    if (!query.isPending && !query.error && query.data === null && redirectWhenMissing) {
      router.replace("/business/setup");
    }
  }, [accessToken, enabled, query.data, query.error, query.isPending, redirectWhenMissing, user]);

  const reload = useCallback(() => {
    return refetch();
  }, [refetch]);

  const updateDraft = useCallback((draft: BusinessOnboardingDraft | null) => {
    queryClient.setQueryData(businessDraftQueryKeys.byAccount(accountId), draft);
  }, [accountId, queryClient]);

  return {
    draft: query.data ?? null,
    loading: canLoad && query.isPending,
    error: query.error instanceof Error ? query.error.message : query.error ? "No pudimos cargar tu club." : null,
    reload,
    updateDraft,
  };
};
