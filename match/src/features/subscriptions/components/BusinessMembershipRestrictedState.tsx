import AppAccessRestrictedState from "@/src/components/ui/AppAccessRestrictedState";
import BusinessProEmblem from "@/src/features/subscriptions/components/BusinessProEmblem";
import type { BusinessMembershipRestriction } from "@/src/features/subscriptions/utils/getEffectiveBusinessMembership";
import type { VenueRole } from "@/src/types/businessAccess";
import { router } from "expo-router";
import { memo } from "react";
import { StyleSheet } from "react-native";

interface BusinessMembershipRestrictedStateProps {
  restriction: BusinessMembershipRestriction;
  role?: VenueRole | null;
  allowBack?: boolean;
}

/** Stable in-place gate: never leaves an empty transition screen under a modal. */
const BusinessMembershipRestrictedState = ({ restriction, allowBack }: BusinessMembershipRestrictedStateProps) => {
  const requiresPro = restriction === "team_requires_pro";
  const openNextStep = () => {
    if (requiresPro) {
      router.push("/business/plan");
      return;
    }

    router.replace("/(tabs)/business-profile");
  };

  return (
    <AppAccessRestrictedState
      title={requiresPro ? "Acceso con Match Pro" : "Acceso no disponible"}
      message={
        requiresPro
          ? "Pide al propietario activar Pro para volver a gestionar el negocio."
          : "No encontramos una membresía activa para esta organización. Revisa tu acceso desde el perfil."
      }
      actionLabel={requiresPro ? "Ver Match Pro" : allowBack ? "Volver al perfil" : "Ir al perfil"}
      onBack={openNextStep}
      tone={requiresPro ? "premium" : "neutral"}
      illustration={requiresPro ? <BusinessProEmblem decorative style={styles.emblem} /> : undefined}
    />
  );
};

export default memo(BusinessMembershipRestrictedState);

const styles = StyleSheet.create({
  emblem: { width: 190, height: 150 },
});
