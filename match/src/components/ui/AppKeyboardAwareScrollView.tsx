import type { ComponentProps } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type AppKeyboardAwareScrollViewProps = ComponentProps<typeof KeyboardAwareScrollView>;

/** Scroll container that keeps the focused field visibly clear of the keyboard. */
const AppKeyboardAwareScrollView = ({ bottomOffset = 24, ...props }: AppKeyboardAwareScrollViewProps) => (
  <KeyboardAwareScrollView
    bottomOffset={bottomOffset}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="interactive"
    {...props}
  />
);

export default AppKeyboardAwareScrollView;
