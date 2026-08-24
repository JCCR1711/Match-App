import { forwardRef, type ComponentProps, type ComponentRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type AppKeyboardAwareScrollViewProps = ComponentProps<typeof KeyboardAwareScrollView>;

/** Scroll container that keeps the focused field visibly clear of the keyboard. */
const AppKeyboardAwareScrollView = forwardRef<ComponentRef<typeof KeyboardAwareScrollView>, AppKeyboardAwareScrollViewProps>(({ bottomOffset = 24, ...props }, ref) => (
  <KeyboardAwareScrollView
    ref={ref}
    bottomOffset={bottomOffset}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="interactive"
    {...props}
  />
));

AppKeyboardAwareScrollView.displayName = "AppKeyboardAwareScrollView";

export default AppKeyboardAwareScrollView;
