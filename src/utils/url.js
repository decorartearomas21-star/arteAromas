const FALLBACK_IMAGE = "/banner.jpg";
const FALLBACK_PATH = "/";

export function sanitizeHttpUrl(value, fallback = FALLBACK_IMAGE) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Not an absolute URL.
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  return fallback;
}

export function sanitizeLinkHref(value, fallback = FALLBACK_PATH) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;

  if (raw.startsWith("#")) return raw;
  if (raw.startsWith("/")) return raw;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Not a valid absolute URL.
  }

  return fallback;
}

export function sanitizeImageSrc(value, fallback = FALLBACK_IMAGE) {
  return sanitizeHttpUrl(value, fallback);
}

export function isRenderableImageSrc(value) {
  return Boolean(sanitizeHttpUrl(value, null));
}
