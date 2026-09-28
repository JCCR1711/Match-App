import { payoutAccountPreview } from "@/src/features/payments/data/paymentsPreview";
import { payoutAccountQueryKeys } from "@/src/features/payments/queries/payoutAccountQueryKeys";
import { payoutAccountGateway } from "@/src/features/payments/services";
import type { PayoutAccountInput } from "@/src/features/payments/types/businessPayments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const missingOrganizationMessage = "No encontramos la organización.";

export const usePayoutAccount = (organizationId: string | null | undefined) => {
  const queryClient = useQueryClient();
  const queryKey = payoutAccountQueryKeys.byOrganization(organizationId ?? "unavailable");

  const accountQuery = useQuery({
    queryKey,
    queryFn: () => {
      if (!organizationId) throw new Error(missingOrganizationMessage);
      return payoutAccountGateway.get(organizationId);
    },
    enabled: Boolean(organizationId),
    placeholderData: payoutAccountPreview,
  });

  const saveAccountMutation = useMutation({
    mutationFn: (input: PayoutAccountInput) => {
      if (!organizationId) throw new Error(missingOrganizationMessage);
      return payoutAccountGateway.save(organizationId, input);
    },
    onSuccess: (account) => {
      if (!organizationId) return;
      queryClient.setQueryData(payoutAccountQueryKeys.byOrganization(organizationId), account);
    },
  });

  const { mutateAsync } = saveAccountMutation;
  const updateAccount = useCallback(
    async (input: PayoutAccountInput) => {
      if (!organizationId) return false;

      try {
        await mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync, organizationId],
  );

  const error = saveAccountMutation.error
    ? "No pudimos guardar la cuenta de depósito."
    : accountQuery.error
      ? "No pudimos cargar la cuenta de depósito."
      : null;

  return {
    account: accountQuery.data ?? payoutAccountPreview,
    loading: Boolean(organizationId) && (accountQuery.isPending || accountQuery.isPlaceholderData),
    saving: saveAccountMutation.isPending,
    error,
    reload: () => accountQuery.refetch(),
    updateAccount,
  };
};
