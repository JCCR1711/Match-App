import {
  AuthenticatedSession,
  AuthGateway,
  AuthStatus,
  SessionStore,
  SignUpRequired,
  User,
  UserMode,
  VerificationOutcome,
} from "@/src/types/auth";
import type { SportsAvatarId } from "@/src/types/avatar";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
  gateway: AuthGateway;
  sessionStore: SessionStore;
}

export function AuthProvider({
  children,
  gateway,
  sessionStore,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<string | null>(
    null,
  );
  const [userEmail, setUserEmail] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [codeExpiresInSeconds, setCodeExpiresInSeconds] = useState(30);
  const [pendingSignUp, setPendingSignUp] =
    useState<SignUpRequired | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [status, setStatus] = useState<AuthStatus>("restoringSession");
  const [error, setError] = useState<string | null>(null);
  const sessionEpochRef = useRef(0);

  const isAuthenticated = Boolean(user && accessToken);
  const loading = status !== "idle";

  const applySession = useCallback(
    async (session: AuthenticatedSession, expectedEpoch = sessionEpochRef.current) => {
      if (expectedEpoch !== sessionEpochRef.current) {
        return;
      }
      await sessionStore.saveRefreshToken(session.tokens.refreshToken);
      if (expectedEpoch !== sessionEpochRef.current) {
        await sessionStore.clearRefreshToken();
        return;
      }
      setUser(session.user);
      setAccessToken(session.tokens.accessToken);
      setAccessTokenExpiresAt(session.tokens.accessTokenExpiresAt);
      setPendingSignUp(null);
      setChallengeId("");
    },
    [sessionStore],
  );

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const restoreEpoch = sessionEpochRef.current;
      try {
        const refreshToken = await sessionStore.getRefreshToken();
        if (!refreshToken) {
          return;
        }

        const session = await gateway.refreshSession(refreshToken);
        if (active) {
          await applySession(session, restoreEpoch);
        }
      } catch {
        await sessionStore.clearRefreshToken();
      } finally {
        if (active) {
          setStatus("idle");
          setInitialized(true);
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [applySession, gateway, sessionStore]);

  const clearSession = useCallback(async () => {
    sessionEpochRef.current += 1;
    setUser(null);
    setAccessToken(null);
    setAccessTokenExpiresAt(null);
    setUserEmail("");
    setChallengeId("");
    setPendingSignUp(null);
    setError(null);
    await sessionStore.clearRefreshToken();
  }, [sessionStore]);

  useEffect(() => {
    if (!user || !accessToken || !accessTokenExpiresAt) {
      return;
    }

    const refreshOneMinuteBeforeExpiry =
      Date.parse(accessTokenExpiresAt) - Date.now() - 60_000;
    const refreshDelay = Math.max(refreshOneMinuteBeforeExpiry, 0);
    let active = true;

    const timeoutId = setTimeout(() => {
      const refreshCurrentSession = async () => {
        const refreshEpoch = sessionEpochRef.current;
        try {
          const refreshToken = await sessionStore.getRefreshToken();
          if (!refreshToken) {
            throw new Error("No hay una sesión renovable.");
          }

          const session = await gateway.refreshSession(refreshToken);
          if (active) {
            await applySession(session, refreshEpoch);
          }
        } catch {
          if (active) {
            await clearSession();
          }
        }
      };

      void refreshCurrentSession();
    }, refreshDelay);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [
    accessToken,
    accessTokenExpiresAt,
    applySession,
    clearSession,
    gateway,
    sessionStore,
    user,
  ]);

  const requestEmailCode = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    setStatus("requestingCode");
    setError(null);

    try {
      if (isAuthenticated) {
        const previousRefreshToken = await sessionStore.getRefreshToken();
        await clearSession();

        if (previousRefreshToken) {
          await gateway
            .revokeSession(previousRefreshToken)
            .catch(() => undefined);
        }
      }

      const challenge = await gateway.requestEmailCode(normalizedEmail);
      setUserEmail(normalizedEmail);
      setChallengeId(challenge.challengeId);
      setCodeExpiresInSeconds(challenge.expiresInSeconds);
      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No pudimos enviar el código.",
      );
      return false;
    } finally {
      setStatus("idle");
    }
  };

  const verifyEmailCode = async (
    code: string,
  ): Promise<VerificationOutcome> => {
    setStatus("verifyingCode");
    setError(null);

    try {
      const result = await gateway.verifyEmailCode(challengeId, code);

      if (result.status === "sign_up_required") {
        setPendingSignUp(result);
        return "sign_up_required";
      }

      await applySession(result);
      return "authenticated";
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "No pudimos verificar el código.",
      );
      return null;
    } finally {
      setStatus("idle");
    }
  };

  const completeSignUp = async (displayName: string) => {
    if (!pendingSignUp) {
      setError("La verificación expiró. Solicita un código nuevo.");
      return false;
    }

    setStatus("completingSignUp");
    setError(null);

    try {
      const session = await gateway.completeSignUp(
        pendingSignUp.enrollmentToken,
        {
          displayName: displayName.trim(),
          acceptedTermsVersion: pendingSignUp.termsVersion,
        },
      );
      await applySession(session);
      return true;
    } catch (signUpError) {
      setError(
        signUpError instanceof Error
          ? signUpError.message
          : "No pudimos completar tu cuenta.",
      );
      return false;
    } finally {
      setStatus("idle");
    }
  };

  const resendEmailCode = async () => {
    if (!userEmail) {
      setError("Primero ingresa tu correo.");
      return false;
    }

    return requestEmailCode(userEmail);
  };

  const selectUserMode = async (mode: UserMode) => {
    if (!accessToken) {
      setError("Tu sesión expiró. Ingresa nuevamente.");
      return false;
    }

    setStatus("selectingMode");
    setError(null);

    try {
      const updatedUser = await gateway.selectUserMode(accessToken, mode);
      setUser(updatedUser);
      return true;
    } catch (modeError) {
      setError(
        modeError instanceof Error
          ? modeError.message
          : "No pudimos guardar tu selección.",
      );
      return false;
    } finally {
      setStatus("idle");
    }
  };

  const signInDemo = async (mode: UserMode) => {
    if (!__DEV__ || !gateway.signInDemo) {
      setError("El acceso de demostración solo está disponible en desarrollo.");
      return false;
    }

    setStatus("signingInDemo");
    setError(null);

    try {
      const previousRefreshToken = await sessionStore.getRefreshToken();
      if (previousRefreshToken) {
        await gateway.revokeSession(previousRefreshToken).catch(() => undefined);
      }
      await clearSession();
      await applySession(await gateway.signInDemo(mode));
      return true;
    } catch (demoError) {
      setError(
        demoError instanceof Error
          ? demoError.message
          : "No pudimos iniciar la demostración.",
      );
      return false;
    } finally {
      setStatus("idle");
    }
  };

  const clearAuthError = () => setError(null);

  const selectAvatar = (avatarId: SportsAvatarId) => {
    setUser((currentUser) => currentUser ? { ...currentUser, avatarId } : currentUser);
  };

  const logout = async () => {
    setStatus("signingOut");
    let refreshToken: string | null = null;
    try {
      refreshToken = await sessionStore.getRefreshToken().catch(() => null);
      await clearSession().catch(() => undefined);

      if (refreshToken) {
        await gateway.revokeSession(refreshToken).catch(() => undefined);
      }
    } finally {
      setStatus("idle");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        initialized,
        loading,
        status,
        error,
        userEmail,
        codeExpiresInSeconds,
        pendingSignUp,
        requestEmailCode,
        verifyEmailCode,
        completeSignUp,
        selectUserMode,
        selectAvatar,
        signInDemo,
        resendEmailCode,
        clearAuthError,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
