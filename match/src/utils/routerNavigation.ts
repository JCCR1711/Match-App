import { router, type Href } from "expo-router";

/** Returns to the previous screen or restores the expected parent after a direct entry. */
export const backOrReplace = (fallback: Href) => {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
};
