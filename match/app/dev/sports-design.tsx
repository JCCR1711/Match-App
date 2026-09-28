import SportsDesignPreviewView from "@/src/features/dev/views/SportsDesignPreviewView";
import { Redirect } from "expo-router";

export default function SportsDesignPreviewRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <SportsDesignPreviewView />;
}
