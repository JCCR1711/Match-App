import type { User } from "@/src/types/auth";
import * as SecureStore from "expo-secure-store";

const MOCK_SESSION_KEY = "match.mock-auth.session";

interface StoredMockSession {
  refreshToken: string;
  user: User;
}

export class MockAuthSessionStore {
  async getUser(refreshToken: string) {
    const session = await this.getSession();
    return session?.refreshToken === refreshToken ? session.user : null;
  }

  async save(refreshToken: string, user: User) {
    if (!(await SecureStore.isAvailableAsync())) return;
    const session: StoredMockSession = { refreshToken, user };
    await SecureStore.setItemAsync(MOCK_SESSION_KEY, JSON.stringify(session), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  async updateUser(user: User) {
    const session = await this.getSession();
    if (!session || session.user.id !== user.id) return;
    await this.save(session.refreshToken, user);
  }

  async remove(refreshToken: string) {
    const session = await this.getSession();
    if (session?.refreshToken !== refreshToken) return;
    await SecureStore.deleteItemAsync(MOCK_SESSION_KEY);
  }

  private async getSession(): Promise<StoredMockSession | null> {
    if (!(await SecureStore.isAvailableAsync())) return null;
    const serializedSession = await SecureStore.getItemAsync(MOCK_SESSION_KEY);
    if (!serializedSession) return null;

    try {
      return JSON.parse(serializedSession) as StoredMockSession;
    } catch {
      await SecureStore.deleteItemAsync(MOCK_SESSION_KEY);
      return null;
    }
  }
}
