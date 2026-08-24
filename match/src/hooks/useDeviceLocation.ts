import DeviceLocationContext from "@/src/context/DeviceLocationContext";
import { useContext } from "react";

const useDeviceLocation = () => {
  const context = useContext(DeviceLocationContext);
  if (!context) throw new Error("useDeviceLocation debe usarse dentro de DeviceLocationProvider");
  return context;
};

export default useDeviceLocation;
