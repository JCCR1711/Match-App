import AppToastContext from "@/src/context/AppToastContext";
import { useContext } from "react";

const useAppToast = () => {
  const context = useContext(AppToastContext);
  if (!context) throw new Error("useAppToast debe usarse dentro de AppToastProvider");
  return context;
};

export default useAppToast;
