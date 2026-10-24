const API_URL = (
    process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080"
).replace(/\/$/, "");

let csrfToken: string | null = null;
let refreshInFlight: Promise<boolean> | null = null;

export async function getCsrf() {
    if (csrfToken) return csrfToken;
    const response = await fetch(`${apiOrigin()}/auth/csrf`, {
        credentials: "include",
        cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok)
        throw new Error(
            body.error || body.status || "Unable to start a secure session",
        );
    csrfToken = body.csrfToken;
    return csrfToken!;
}

async function refreshSession() {
    if (typeof window === "undefined") return false;
    if (!refreshInFlight)
        refreshInFlight = (async () => {
            try {
                const csrf = await getCsrf();
                const response = await fetch(`${apiOrigin()}/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "X-CSRF-Token": csrf },
                });
                if (response.ok) return true;
                csrfToken = null;
                return false;
            } catch {
                return false;
            } finally {
                refreshInFlight = null;
            }
        })();
    return refreshInFlight;
}

export async function api<T>(
    path: string,
    options: RequestInit = {},
    retry = true,
): Promise<T> {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers);
    if (options.body && !headers.has("Content-Type"))
        headers.set("Content-Type", "application/json");

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (
        !["GET", "HEAD", "OPTIONS"].includes(method) &&
        !normalizedPath.endsWith("/auth/csrf")
    ) {
        headers.set("X-CSRF-Token", await getCsrf());
    }

    const response = await fetch(`${apiOrigin()}${normalizedPath}`, {
        ...options,
        method,
        headers,
        credentials: "include",
        cache: "no-store",
    });

    if (
        response.status === 401 &&
        retry &&
        !normalizedPath.endsWith("/auth/refresh") &&
        !normalizedPath.endsWith("/auth/login") &&
        !normalizedPath.endsWith("/auth/signin")
    ) {
        if (await refreshSession()) return api<T>(path, options, false);
    }

    const body = await response.json().catch(() => ({}));
    if (!response.ok)
        throw new Error(
            body.error ||
                body.status ||
                "Something went wrong. Please try again.",
        );
    return body as T;
}

export function apiOrigin() {
    if (typeof window === "undefined")
        return (process.env.API_INTERNAL_URL || API_URL).replace(/\/$/, "");
    return API_URL;
}
