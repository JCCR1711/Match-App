import { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const COLLAPSIBLE_HEADER_EXPANDED_HEIGHT = 58;
export const COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT = 44;

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
