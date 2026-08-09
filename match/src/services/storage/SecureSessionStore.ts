import { SessionStore } from "@/src/types/auth";
import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "match.auth.refresh-token";

export class SecureSessionStore implements SessionStore {
  async getRefreshToken() {
    if (!(await SecureStore.isAvailableAsync())) {
      return null;
    }

    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async saveRefreshToken(refreshToken: string) {
    if (!(await SecureStore.isAvailableAsync())) {
      return;
    }

    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  async clearRefreshToken() {
    if (!(await SecureStore.isAvailableAsync())) {
      return;
    }

    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}
