import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { BusinessOnboardingDraft } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";

interface UseBusinessDraftOptions {
  redirectWhenMissing?: boolean;
  enabled?: boolean;
}

export const useBusinessDraft = ({
  redirectWhenMissing = true,
  enabled = true,
}: UseBusinessDraftOptions = {}) => {
  const { accessToken } = useAuth();
  const [draft, setDraft] = useState<BusinessOnboardingDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((current) => current + 1), []);

  useFocusEffect(
    useCallback(() => {
      void reloadKey;
      if (!enabled) {
        setLoading(false);
        return undefined;
      }

      if (!accessToken) {
        router.replace("/");
        return undefined;
      }

      let active = true;
      setLoading(true);
      setError(null);

      const load = async () => {
        try {
          const currentDraft =
            await venueOnboardingGateway.getBusinessDraft(accessToken);
          if (!active) return;
          if (!currentDraft && redirectWhenMissing) {
            router.replace("/business/setup");
            return;
          }
          setDraft(currentDraft);
        } catch (loadError) {
          if (active) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : "No pudimos cargar tu club.",
            );
          }
        } finally {
          if (active) setLoading(false);
        }
      };

      void load();
      return () => {
        active = false;
      };
    }, [accessToken, enabled, redirectWhenMissing, reloadKey]),
  );

  return { draft, loading, error, reload };
};
