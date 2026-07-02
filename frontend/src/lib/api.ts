/**
 * Tiny typed fetch wrapper.
 *
 * For this boilerplate it is used ONLY by the auth calls. It attaches the JWT
 * (held in memory by AuthContext) to the Authorization header. A token getter
 * is injected at app startup so this module stays free of React dependencies.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

let tokenGetter: () => string | null = () => null;

/** Register how the API layer should read the current in-memory JWT. */
export function setAuthTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip attaching the Authorization header (e.g. for login). */
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = tokenGetter();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Is the backend running?");
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data?.detail) detail = data.detail;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
};

// --- Auth-specific typed calls (the only real backend integration) ---

export interface AuthUser {
  id: string;
  username: string;
  name: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<TokenResponse>(
      "/auth/login",
      { username, password },
      { auth: false },
    ),
  me: () => api.get<AuthUser>("/auth/me"),
};
