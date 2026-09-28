const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type ApiOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { skipAuth, ...requestOptions } = options;

  const headers = new Headers(requestOptions.headers);

  headers.set("Content-Type", "application/json");

  if (!skipAuth && typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();

    let errorMessage = message;

    try {
      const parsed = JSON.parse(message);

      if (Array.isArray(parsed.message)) {
        errorMessage = parsed.message.join(", ");
      } else if (parsed.message) {
        errorMessage = parsed.message;
      }
    } catch {
      // Response was not JSON.
    }

    throw new Error(
      errorMessage || `API request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function saveAccessToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
}

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }

  return null;
}

export function clearAccessToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export function saveRefreshToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("refreshToken", token);
  }
}

export { API_BASE_URL };