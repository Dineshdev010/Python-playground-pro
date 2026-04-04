const configuredBaseUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim().replace(/\/+$/, "") || "";

function isLocalOrigin(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

export function getAppBaseUrl() {
  if (typeof window === "undefined") {
    return configuredBaseUrl;
  }

  const currentOrigin = window.location.origin;
  if (configuredBaseUrl && isLocalOrigin(currentOrigin)) {
    return configuredBaseUrl;
  }

  return currentOrigin;
}

export function getPublicUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getAppBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}
