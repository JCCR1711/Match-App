import type { SportsAvatarId } from "./avatar";

export type UserMode = "player" | "venue_manager";

export interface User {
  id: string;
  displayName: string;
  email: string;
  availableModes: UserMode[];
  activeMode: UserMode | null;
  avatarId?: SportsAvatarId;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}

export interface AuthenticatedSession {
  user: User;
  tokens: SessionTokens;
}

export interface SignUpRequired {
  status: "sign_up_required";
  verifiedEmail: string;
  enrollmentToken: string;
  termsVersion: string;
}

export interface AuthenticationSucceeded extends AuthenticatedSession {
  status: "authenticated";
}

export type VerifyEmailResult = AuthenticationSucceeded | SignUpRequired;

export interface CompleteSignUpInput {
  displayName: string;
  acceptedTermsVersion: string;
}

export interface EmailCodeChallenge {
  challengeId: string;
  expiresInSeconds: number;
}

export interface AuthGateway {
  requestEmailCode(email: string): Promise<EmailCodeChallenge>;
  verifyEmailCode(
    challengeId: string,
    code: string,
  ): Promise<VerifyEmailResult>;
  completeSignUp(
    enrollmentToken: string,
    input: CompleteSignUpInput,
  ): Promise<AuthenticatedSession>;
  selectUserMode(accessToken: string, mode: UserMode): Promise<User>;
  refreshSession(refreshToken: string): Promise<AuthenticatedSession>;
  revokeSession(refreshToken: string): Promise<void>;
  signInDemo?(mode: UserMode): Promise<AuthenticatedSession>;
}

export interface SessionStore {
  getRefreshToken(): Promise<string | null>;
  saveRefreshToken(refreshToken: string): Promise<void>;
  clearRefreshToken(): Promise<void>;
}

export type AuthStatus =
  | "restoringSession"
  | "idle"
  | "requestingCode"
  | "verifyingCode"
  | "completingSignUp"
  | "selectingMode"
  | "signingInDemo"
  | "signingOut";

export type VerificationOutcome =
  | "authenticated"
  | "sign_up_required"
  | null;

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  status: AuthStatus;
  error: string | null;
  userEmail: string;
  codeExpiresInSeconds: number;
  pendingSignUp: SignUpRequired | null;
  requestEmailCode: (email: string) => Promise<boolean>;
  verifyEmailCode: (code: string) => Promise<VerificationOutcome>;
  completeSignUp: (displayName: string) => Promise<boolean>;
  selectUserMode: (mode: UserMode) => Promise<boolean>;
  selectAvatar: (avatarId: SportsAvatarId) => void;
  signInDemo: (mode: UserMode) => Promise<boolean>;
  resendEmailCode: () => Promise<boolean>;
  clearAuthError: () => void;
  logout: () => Promise<void>;
}
