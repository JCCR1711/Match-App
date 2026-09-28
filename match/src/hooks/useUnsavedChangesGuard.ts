import {
  useNavigation,
  usePreventRemove,
  type NavigationAction,
} from "expo-router/react-navigation";
import { useCallback, useState } from "react";

interface UnsavedChangesGuard {
  confirmationVisible: boolean;
  keepEditing: () => void;
  discardChanges: () => void;
  leaveWithoutPrompt: (navigate: () => void) => void;
}

const useUnsavedChangesGuard = (
  hasUnsavedChanges: boolean,
): UnsavedChangesGuard => {
  const navigation = useNavigation();
  const [pendingAction, setPendingAction] = useState<NavigationAction | null>(
    null,
  );
  const [navigationAllowed, setNavigationAllowed] = useState(false);

  usePreventRemove(hasUnsavedChanges && !navigationAllowed, ({ data }) => {
    setPendingAction(data.action);
  });

  const keepEditing = useCallback(() => setPendingAction(null), []);
  const discardChanges = useCallback(() => {
    if (!pendingAction) return;
    setNavigationAllowed(true);
    setPendingAction(null);
    requestAnimationFrame(() => navigation.dispatch(pendingAction));
  }, [navigation, pendingAction]);
  const leaveWithoutPrompt = useCallback((navigate: () => void) => {
    setNavigationAllowed(true);
    requestAnimationFrame(navigate);
  }, []);

  return {
    confirmationVisible: pendingAction !== null,
    keepEditing,
    discardChanges,
    leaveWithoutPrompt,
  };
};

export default useUnsavedChangesGuard;
