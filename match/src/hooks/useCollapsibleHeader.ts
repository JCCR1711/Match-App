import { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const COLLAPSIBLE_HEADER_EXPANDED_HEIGHT = 52;
export const COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT = 40;
export const SCROLL_TITLE_HEADER_HEIGHT = 36;

export const useCollapsibleHeader = () => {
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return {
    scrollY,
    onScroll,
    headerContentInset: insets.top + COLLAPSIBLE_HEADER_EXPANDED_HEIGHT,
  };
};
