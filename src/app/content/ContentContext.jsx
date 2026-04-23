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
const THEME_PRESET_VERSION =
  fallbackContent.settings.theme.presetVersion || "2026-04-cleaning-green";

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

function mergeThemeSettings(incomingTheme) {
  const defaultTheme = fallbackContent.settings.theme;
  const savedTheme =
    incomingTheme && typeof incomingTheme === "object" ? incomingTheme : {};

  if (savedTheme.presetVersion === THEME_PRESET_VERSION) {
    return {
      ...defaultTheme,
      ...savedTheme,
      presetVersion: THEME_PRESET_VERSION,
    };
  }

  return {
    ...defaultTheme,
    presetVersion: THEME_PRESET_VERSION,
  };
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
      theme: mergeThemeSettings(incoming.settings?.theme),
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
    const theme = content.settings.theme;
    const accent = theme.accent;
    const accentHover = theme.accentHover;
    const primary = theme.primary;

    const accentTriplet = hexToRgbTriplet(accent);
    const accentHoverTriplet = hexToRgbTriplet(accentHover);
    const primaryTriplet = hexToRgbTriplet(primary);
    const ctaButtonBgTriplet = hexToRgbTriplet(theme.ctaButtonBg);

    if (accentTriplet)
      root.style.setProperty("--renora-accent-rgb", accentTriplet);
    if (accentHoverTriplet)
      root.style.setProperty("--renora-accent-hover-rgb", accentHoverTriplet);
    if (primaryTriplet)
      root.style.setProperty("--renora-primary-rgb", primaryTriplet);
    if (ctaButtonBgTriplet)
      root.style.setProperty("--cta-button-bg-rgb", ctaButtonBgTriplet);

    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--foreground", theme.foreground);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-foreground", theme.primaryForeground);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--muted-foreground", theme.mutedForeground);
    root.style.setProperty("--card", theme.card);
    root.style.setProperty("--card-foreground", theme.cardForeground);
    root.style.setProperty("--card-border", theme.cardBorder);
    root.style.setProperty("--card-border-hover", theme.cardBorderHover);
    root.style.setProperty("--icon-primary", theme.iconPrimary);
    root.style.setProperty("--icon-on-accent", theme.iconOnAccent);
    root.style.setProperty("--icon-accent", theme.iconAccent);
    root.style.setProperty("--icon-accent-soft", theme.iconAccentSoft);
    root.style.setProperty("--form-label-text", theme.formLabelText);
    root.style.setProperty("--form-input-border", theme.formInputBorder);
    root.style.setProperty(
      "--form-input-focus-border",
      theme.formInputFocusBorder,
    );
    root.style.setProperty("--border", theme.cardBorder);
    root.style.setProperty("--input-background", theme.inputBackground);
    root.style.setProperty("--nav-link-text", theme.navLinkText);
    root.style.setProperty("--nav-link-hover", theme.navLinkHover);
    root.style.setProperty("--nav-button-bg", theme.navButtonBg);
    root.style.setProperty("--nav-button-hover-bg", theme.navButtonHoverBg);
    root.style.setProperty("--nav-button-text", theme.navButtonText);
    root.style.setProperty("--badge-text", theme.badgeText);
    root.style.setProperty("--badge-bg", theme.badgeBg);
    root.style.setProperty("--form-input-text", theme.formInputText);

    root.style.setProperty(
      "--button-default-bg",
      theme.buttonDefaultBg || theme.ctaButtonBg,
    );
    root.style.setProperty(
      "--button-default-hover-bg",
      theme.buttonDefaultHoverBg || theme.ctaButtonHoverBg,
    );
    root.style.setProperty(
      "--button-default-text",
      theme.buttonDefaultText || theme.ctaButtonText,
    );
    root.style.setProperty(
      "--button-secondary-bg",
      theme.buttonSecondaryBg || theme.muted,
    );
    root.style.setProperty(
      "--button-secondary-hover-bg",
      theme.buttonSecondaryHoverBg || theme.card,
    );
    root.style.setProperty(
      "--button-secondary-text",
      theme.buttonSecondaryText || theme.foreground,
    );
    root.style.setProperty(
      "--button-destructive-bg",
      theme.buttonDestructiveBg || "#dc2626",
    );
    root.style.setProperty(
      "--button-destructive-hover-bg",
      theme.buttonDestructiveHoverBg || "#b91c1c",
    );
    root.style.setProperty(
      "--button-destructive-text",
      theme.buttonDestructiveText || "#ffffff",
    );
    root.style.setProperty(
      "--button-outline-border",
      theme.buttonOutlineBorder || theme.outlineButtonBorder,
    );
    root.style.setProperty(
      "--button-outline-hover-border",
      theme.buttonOutlineHoverBorder ||
        theme.buttonOutlineBorder ||
        theme.outlineButtonBorder,
    );
    root.style.setProperty(
      "--button-outline-text",
      theme.buttonOutlineText || theme.outlineButtonText,
    );
    root.style.setProperty(
      "--button-outline-hover-bg",
      theme.buttonOutlineHoverBg || theme.outlineButtonHoverBg,
    );
    root.style.setProperty(
      "--button-outline-hover-text",
      theme.buttonOutlineHoverText || theme.outlineButtonHoverText,
    );
    root.style.setProperty(
      "--button-ghost-text",
      theme.buttonGhostText || theme.foreground,
    );
    root.style.setProperty(
      "--button-ghost-hover-bg",
      theme.buttonGhostHoverBg || "rgba(212, 175, 55, 0.12)",
    );

    root.style.setProperty("--cta-button-bg", theme.ctaButtonBg);
    root.style.setProperty("--cta-button-hover-bg", theme.ctaButtonHoverBg);
    root.style.setProperty("--cta-button-text", theme.ctaButtonText);
    root.style.setProperty(
      "--outline-button-border",
      theme.outlineButtonBorder,
    );
    root.style.setProperty("--outline-button-text", theme.outlineButtonText);
    root.style.setProperty(
      "--outline-button-hover-bg",
      theme.outlineButtonHoverBg,
    );
    root.style.setProperty(
      "--outline-button-hover-text",
      theme.outlineButtonHoverText,
    );

    root.style.setProperty("--hero-overlay", theme.heroOverlay);
    root.style.setProperty("--promo-overlay", theme.promoOverlay);
    root.style.setProperty("--image-overlay-text", theme.imageOverlayText);
    root.style.setProperty(
      "--image-overlay-muted-text",
      theme.imageOverlayMutedText,
    );
    root.style.setProperty(
      "--image-overlay-panel-bg",
      theme.imageOverlayPanelBg,
    );
    root.style.setProperty(
      "--image-overlay-panel-border",
      theme.imageOverlayPanelBorder,
    );
    root.style.setProperty("--promo-shine", theme.promoShine);

    root.style.setProperty("--surface-base", theme.surfaceBase);
    root.style.setProperty("--surface-elevated", theme.surfaceElevated);
    root.style.setProperty(
      "--surface-elevated-soft",
      theme.surfaceElevatedSoft,
    );
    root.style.setProperty(
      "--surface-elevated-hover",
      theme.surfaceElevatedHover,
    );

    root.style.setProperty("--footer-bg", theme.footerBackground);
    root.style.setProperty("--footer-muted-text", theme.footerMutedText);
    root.style.setProperty("--footer-heading", theme.footerHeading);
    root.style.setProperty("--footer-link-hover", theme.footerLinkHover);
    root.style.setProperty("--footer-social-bg", theme.footerSocialBg);
    root.style.setProperty(
      "--footer-social-hover-bg",
      theme.footerSocialHoverBg,
    );
    root.style.setProperty("--footer-social-icon", theme.footerSocialIcon);
    root.style.setProperty(
      "--footer-social-icon-hover",
      theme.footerSocialIconHover,
    );

    root.style.setProperty(
      "--before-after-handle-border",
      theme.beforeAfterHandleBorder,
    );
    root.style.setProperty(
      "--before-after-handle-icon",
      theme.beforeAfterHandleIcon,
    );
    root.style.setProperty("--before-after-label-bg", theme.beforeAfterLabelBg);
    root.style.setProperty(
      "--before-after-label-text",
      theme.beforeAfterLabelText,
    );
  }, [content.settings.theme]);

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
