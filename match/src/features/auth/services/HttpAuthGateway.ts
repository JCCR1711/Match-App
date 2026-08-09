import {
  AuthenticatedSession,
  AuthGateway,
  CompleteSignUpInput,
  EmailCodeChallenge,
  VerifyEmailResult,
  User,
  UserMode,
} from "@/src/types/auth";

interface ApiErrorResponse {
  message?: string;
}

export class HttpAuthGateway implements AuthGateway {
  constructor(private readonly baseUrl: string) {}

  requestEmailCode(email: string) {
    return this.request<EmailCodeChallenge>("/auth/email/code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  verifyEmailCode(challengeId: string, code: string) {
    return this.request<VerifyEmailResult>("/auth/email/verify", {
      method: "POST",
      body: JSON.stringify({ challengeId, code }),
    });
  }

  completeSignUp(enrollmentToken: string, input: CompleteSignUpInput) {
    return this.request<AuthenticatedSession>("/auth/sign-up/complete", {
      method: "POST",
      body: JSON.stringify({ enrollmentToken, ...input }),
    });
  }

  selectUserMode(accessToken: string, mode: UserMode) {
    return this.request<User>("/users/me/mode", {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ mode }),
    });
  }

  refreshSession(refreshToken: string) {
    return this.request<AuthenticatedSession>("/auth/session/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async revokeSession(refreshToken: string) {
    await this.request<void>("/auth/session/revoke", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  private async request<Response>(path: string, init: RequestInit) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!response.ok) {
      const error = (await response
        .json()
        .catch(() => ({}))) as ApiErrorResponse;
      throw new Error(error.message ?? "No pudimos completar la solicitud.");
    }

    if (response.status === 204) {
      return undefined as Response;
    }

    return (await response.json()) as Response;
  }
}
