export const businessDraftQueryKeys = {
  all: ["business-draft"] as const,
  byAccount: (accountId: string) => [...businessDraftQueryKeys.all, accountId] as const,
};
