import AppAccessRestrictedState from "@/src/components/ui/AppAccessRestrictedState";

const FinanceAccessNotice = () => (
  <AppAccessRestrictedState
    title="Acceso restringido"
    message="Las finanzas del club están disponibles para propietarios y gestores."
  />
);

export default FinanceAccessNotice;
