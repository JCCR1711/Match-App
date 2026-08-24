import {
  AuthenticatedSession,
  AuthGateway,
  CompleteSignUpInput,
  User,
  UserMode,
} from "@/src/types/auth";
import { MockAuthSessionStore } from "./MockAuthSessionStore";

const MOCK_VERIFICATION_CODE = "123456";
const CODE_EXPIRATION_SECONDS = 30;
const REGISTERED_EMAIL = "demo@match.app";
const RESERVED_USERNAMES = new Set(["jugador_demo", "josue17", "josue_negocio"]);

const wait = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration));

const createTokens = (userId: string) => ({
  accessToken: `mock-access-${encodeURIComponent(userId)}.${Date.now()}`,
  refreshToken: `mock-refresh-${Date.now()}`,
  accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
});

export class MockAuthGateway implements AuthGateway {
  private readonly emailsByChallenge = new Map<string, string>();
  private readonly emailsByEnrollment = new Map<string, string>();
  private readonly usersByAccessToken = new Map<string, User>();
  private readonly usersByRefreshToken = new Map<string, User>();

  constructor(
    private readonly sessionStore = new MockAuthSessionStore(),
  ) {}

  private async createSession(user: User): Promise<AuthenticatedSession> {
    const tokens = createTokens(user.id);
    this.usersByAccessToken.set(tokens.accessToken, user);
    this.usersByRefreshToken.set(tokens.refreshToken, user);
    await this.sessionStore.save(tokens.refreshToken, user);
    return { user, tokens };
  }

  async signInDemo(mode: UserMode) {
    await wait(250);

    return this.createSession(
      mode === "player"
        ? {
            id: "mock-player-1",
            displayName: "Josue",
            username: "josue17",
            email: "jugador@match.demo",
            availableModes: ["player"],
            activeMode: "player",
          }
        : {
            id: "mock-venue-owner-1",
            displayName: "Josue",
            username: "josue_negocio",
            email: "negocio@match.demo",
            availableModes: ["player", "venue_manager"],
            activeMode: "venue_manager",
          },
    );
  }

  async requestEmailCode(email: string) {
    await wait(350);
    const challengeId = `mock-${Date.now()}`;
    this.emailsByChallenge.set(challengeId, email);

    return {
      challengeId,
      expiresInSeconds: CODE_EXPIRATION_SECONDS,
    };
  }

  async verifyEmailCode(challengeId: string, code: string) {
    await wait(350);
    const email = this.emailsByChallenge.get(challengeId);

    if (!email || code !== MOCK_VERIFICATION_CODE) {
      throw new Error("Código incorrecto. Intenta otra vez.");
    }

    this.emailsByChallenge.delete(challengeId);

    if (email !== REGISTERED_EMAIL) {
      const enrollmentToken = `mock-enrollment-${Date.now()}`;
      this.emailsByEnrollment.set(enrollmentToken, email);
      return {
        status: "sign_up_required" as const,
        verifiedEmail: email,
        enrollmentToken,
        termsVersion: "2026-08",
      };
    }

    return {
      status: "authenticated" as const,
      ...(await this.createSession({
        id: "mock-player-1",
        displayName: "Jugador Demo",
        username: "jugador_demo",
        email,
        availableModes: ["player"],
        activeMode: "player",
      })),
    };
  }

  async completeSignUp(
    enrollmentToken: string,
    input: CompleteSignUpInput,
  ) {
    await wait(350);
    const email = this.emailsByEnrollment.get(enrollmentToken);

    if (!email || !input.acceptedTermsVersion) {
      throw new Error("No pudimos completar el registro.");
    }

    if (RESERVED_USERNAMES.has(input.username)) {
      throw new Error("Ese nombre de usuario ya está en uso.");
    }

    this.emailsByEnrollment.delete(enrollmentToken);
    RESERVED_USERNAMES.add(input.username);

    return this.createSession({
      id: `mock-user-${Date.now()}`,
      displayName: input.displayName,
      username: input.username,
      email,
      availableModes: [],
      activeMode: null,
    });
  }

  async selectUserMode(accessToken: string, mode: UserMode) {
    await wait(250);
    const user = this.usersByAccessToken.get(accessToken);

    if (!user) {
      throw new Error("La sesión expiró. Ingresa nuevamente.");
    }

    const updatedUser: User = {
      ...user,
      availableModes: Array.from(new Set([...user.availableModes, mode])),
      activeMode: mode,
    };

    this.usersByAccessToken.set(accessToken, updatedUser);
    this.usersByRefreshToken.forEach((storedUser, refreshToken) => {
      if (storedUser.id === user.id) {
        this.usersByRefreshToken.set(refreshToken, updatedUser);
      }
    });
    await this.sessionStore.updateUser(updatedUser);

    return updatedUser;
  }

  async refreshSession(refreshToken: string) {
    await wait(200);
    const user =
      this.usersByRefreshToken.get(refreshToken) ??
      (await this.sessionStore.getUser(refreshToken));

    if (!user) {
      throw new Error("La sesión expiró.");
    }

    this.usersByRefreshToken.delete(refreshToken);
    await this.sessionStore.remove(refreshToken);
    return this.createSession(user);
  }

  async revokeSession(refreshToken: string) {
    await wait(150);
    this.usersByRefreshToken.delete(refreshToken);
    await this.sessionStore.remove(refreshToken);
  }
}
