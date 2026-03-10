import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fallbackContent } from "./fallbackContent";

const CmsContext = createContext(null);

function normalizeFixedImageSlots(value, fallback, slots) {
  const next = [];
  const incoming = Array.isArray(value) ? value : [];

  for (let i = 0; i < slots; i++) {
    const candidate = incoming[i];
    if (typeof candidate === "string" && candidate.trim()) {
      next[i] = candidate;
    } else {
      next[i] = fallback[i] ?? "";
    }
  }

  return next;
}

function mergeCmsContent(incoming) {
  if (!incoming) return fallbackContent;

  return {
    ...fallbackContent,
    ...incoming,
    services: Array.isArray(incoming.services)
      ? incoming.services
      : fallbackContent.services,
    banners: Array.isArray(incoming.banners)
      ? incoming.banners
      : fallbackContent.banners,
    testimonials: Array.isArray(incoming.testimonials)
      ? incoming.testimonials
      : fallbackContent.testimonials,
    settings: {
      ...fallbackContent.settings,
      ...(incoming.settings ?? {}),
      hero: {
        ...fallbackContent.settings.hero,
        ...(incoming.settings?.hero ?? {}),
      },
      theme: {
        ...fallbackContent.settings.theme,
        ...(incoming.settings?.theme ?? {}),
      },
      about: {
        ...fallbackContent.settings.about,
        ...(incoming.settings?.about ?? {}),
        images: normalizeFixedImageSlots(
          incoming.settings?.about?.images,
          fallbackContent.settings.about.images,
          4,
        ),
      },
      contact: {
        ...fallbackContent.settings.contact,
        ...(incoming.settings?.contact ?? {}),
      },
      sections: {
        ...fallbackContent.settings.sections,
        ...(incoming.settings?.sections ?? {}),
        services: {
          ...fallbackContent.settings.sections.services,
          ...(incoming.settings?.sections?.services ?? {}),
        },
        beforeAfter: {
          ...fallbackContent.settings.sections.beforeAfter,
          ...(incoming.settings?.sections?.beforeAfter ?? {}),
        },
        testimonials: {
          ...fallbackContent.settings.sections.testimonials,
          ...(incoming.settings?.sections?.testimonials ?? {}),
        },
        contact: {
          ...fallbackContent.settings.sections.contact,
          ...(incoming.settings?.sections?.contact ?? {}),
        },
      },
      beforeAfter: {
        ...fallbackContent.settings.beforeAfter,
        ...(incoming.settings?.beforeAfter ?? {}),
      },
    },
  };
}

function hexToRgbTriplet(value) {
  const raw = value.trim().replace(/^#/, "");

  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return `${r} ${g} ${b}`;
  }

  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return `${r} ${g} ${b}`;
  }

  return null;
}

async function fetchJson(input, init) {
  const response = await fetch(input, init);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return await response.json();
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallbackContent);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const incoming = await fetchJson("/api/content");
      const next = mergeCmsContent(incoming);
      setContent(next);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load content");
      setContent(fallbackContent);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const root = document.documentElement;
    const accent = content.settings.theme.accent;
    const accentHover = content.settings.theme.accentHover;

    const accentTriplet = hexToRgbTriplet(accent);
    const accentHoverTriplet = hexToRgbTriplet(accentHover);

    if (accentTriplet)
      root.style.setProperty("--cios-accent-rgb", accentTriplet);
    if (accentHoverTriplet)
      root.style.setProperty("--cios-accent-hover-rgb", accentHoverTriplet);

    root.style.setProperty("--background", content.settings.theme.background);
    root.style.setProperty("--foreground", content.settings.theme.foreground);
    root.style.setProperty("--primary", content.settings.theme.primary);
    root.style.setProperty(
      "--primary-foreground",
      content.settings.theme.primaryForeground,
    );
    root.style.setProperty("--muted", content.settings.theme.muted);
    root.style.setProperty(
      "--muted-foreground",
      content.settings.theme.mutedForeground,
    );
    root.style.setProperty("--card", content.settings.theme.card);
    root.style.setProperty(
      "--card-foreground",
      content.settings.theme.cardForeground,
    );
    root.style.setProperty(
      "--input-background",
      content.settings.theme.inputBackground,
    );
    root.style.setProperty(
      "--nav-link-text",
      content.settings.theme.navLinkText,
    );
    root.style.setProperty(
      "--nav-link-hover",
      content.settings.theme.navLinkHover,
    );
    root.style.setProperty(
      "--nav-button-bg",
      content.settings.theme.navButtonBg,
    );
    root.style.setProperty(
      "--nav-button-hover-bg",
      content.settings.theme.navButtonHoverBg,
    );
    root.style.setProperty(
      "--nav-button-text",
      content.settings.theme.navButtonText,
    );
    root.style.setProperty("--badge-text", content.settings.theme.badgeText);
    root.style.setProperty("--badge-bg", content.settings.theme.badgeBg);
  }, [
    content.settings.theme.accent,
    content.settings.theme.accentHover,
    content.settings.theme.background,
    content.settings.theme.foreground,
    content.settings.theme.primary,
    content.settings.theme.primaryForeground,
    content.settings.theme.muted,
    content.settings.theme.mutedForeground,
    content.settings.theme.card,
    content.settings.theme.cardForeground,
    content.settings.theme.inputBackground,
    content.settings.theme.navLinkText,
    content.settings.theme.navLinkHover,
    content.settings.theme.navButtonBg,
    content.settings.theme.navButtonHoverBg,
    content.settings.theme.navButtonText,
    content.settings.theme.badgeText,
    content.settings.theme.badgeBg,
  ]);

  const value = useMemo(
    () => ({
      content,
      status,
      error,
      refresh,
      setLocalContent: (next) => setContent(mergeCmsContent(next)),
    }),
    [content, status, error, refresh],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within <ContentProvider />");
  return ctx;
}
