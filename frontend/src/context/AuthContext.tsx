import * as React from "react";

import { authApi, setAuthTokenGetter, type AuthUser } from "@/lib/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

/**
 * Auth provider. The JWT is held ONLY in memory (React ref/state) — never in
 * localStorage — so a full page reload requires signing in again, by design.
 *
 * Flow:
 *  - login()  -> POST /auth/login, store token in memory, then GET /auth/me
 *  - on mount -> if a token is present, verify it via GET /auth/me
 *  - logout() -> clear token + user
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const tokenRef = React.useRef<string | null>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  // Let the API layer read the in-memory token for the Authorization header.
  React.useEffect(() => {
    setAuthTokenGetter(() => tokenRef.current);
  }, []);

  // Bootstrap: verify an existing in-memory token on first render. On a fresh
  // page load there is no token, so this resolves immediately to unauthenticated.
  React.useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!tokenRef.current) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) {
          setUser(me);
          setStatus("authenticated");
        }
      } catch {
        if (!cancelled) {
          tokenRef.current = null;
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(
    async (username: string, password: string) => {
      const { access_token } = await authApi.login(username, password);
      tokenRef.current = access_token;
      // Verify the token and fetch the user profile from the protected endpoint.
      const me = await authApi.me();
      setUser(me);
      setStatus("authenticated");
    },
    [],
  );

  const logout = React.useCallback(() => {
    tokenRef.current = null;
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ status, user, login, logout }),
    [status, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
