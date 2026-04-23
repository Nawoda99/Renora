import { useEffect, useRef, useState } from "react";
import { useCms } from "../content/ContentContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { iconComponentFromKey } from "../content/iconMap";
import { MediaLibraryDialog } from "../components/admin/MediaLibraryDialog";
import { IconPickerDialog } from "../components/admin/IconPickerDialog";
import { MediaLibraryPanel } from "../components/admin/MediaLibraryPanel";
import { Slider } from "../components/ui/slider";
import { Download } from "lucide-react";

function parseColorOpacity(value = "") {
  const m = value.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (m) {
    const r = +m[1],
      g = +m[2],
      b = +m[3];
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    const hex =
      "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
    return { hex, opacity: Math.round(a * 100) };
  }
  const h8 = value.match(/^#([0-9a-f]{6})([0-9a-f]{2})$/i);
  if (h8) {
    const a = parseInt(h8[2], 16) / 255;
    return { hex: "#" + h8[1], opacity: Math.round(a * 100) };
  }
  if (/^#[0-9a-f]{3,6}$/i.test(value)) {
    return { hex: value.slice(0, 7), opacity: 100 };
  }
  return { hex: "#000000", opacity: 100 };
}

function toRgba(hex, opacity) {
  const clean = hex.replace(/^#/, "").slice(0, 6).padEnd(6, "0");
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  const a = +(opacity / 100).toFixed(2);
  return a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}

function RgbaColorPicker({ value, onChange }) {
  const { hex, opacity } = parseColorOpacity(value);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(toRgba(e.target.value, opacity))}
          className="h-10 w-14 p-1 shrink-0 rounded border cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm"
          placeholder="rgb(r, g, b) or #rrggbb"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-16 shrink-0">
          Opacity
        </span>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[opacity]}
          onValueChange={([v]) => onChange(toRgba(hex, v))}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-10 text-right">
          {opacity}%
        </span>
      </div>
    </div>
  );
}

function TextStyleControls({ style, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <Label className="text-xs">Font</Label>
        <Select
          value={style?.font || "sans"}
          onValueChange={(value) => onChange({ ...style, font: value })}
        >
          <SelectTrigger className="h-8 text-xs border-[rgb(var(--renora-accent-rgb)/0.3)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans">Sans</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Mono</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Color</Label>
        <div className="flex gap-1">
          <input
            type="color"
            value={style?.color || "#000000"}
            onChange={(e) => onChange({ ...style, color: e.target.value })}
            className="h-8 w-8 p-1 rounded border cursor-pointer shrink-0"
          />
          <Input
            type="text"
            value={style?.color || "#000000"}
            onChange={(e) => onChange({ ...style, color: e.target.value })}
            className="font-mono text-xs h-8"
            placeholder="#000000"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Bold</Label>
        <div className="flex items-center h-8">
          <Switch
            checked={style?.bold || false}
            onCheckedChange={(checked) => onChange({ ...style, bold: checked })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Italic</Label>
        <div className="flex items-center h-8">
          <Switch
            checked={style?.italic || false}
            onCheckedChange={(checked) =>
              onChange({ ...style, italic: checked })
            }
          />
        </div>
      </div>
    </div>
  );
}

const ADMIN_SECTIONS = [
  { id: "hero", hash: "#admin-hero", label: "Hero" },
  { id: "colors", hash: "#admin-colors", label: "Colors" },
  { id: "media", hash: "#admin-media", label: "Media" },
  { id: "banners", hash: "#admin-banners", label: "Promo Banners" },
  { id: "services", hash: "#admin-services", label: "Services" },
  { id: "beforeAfter", hash: "#admin-before-after", label: "Before / After" },
  { id: "about", hash: "#admin-about", label: "About" },
  { id: "testimonials", hash: "#admin-testimonials", label: "Testimonials" },
  { id: "contact", hash: "#admin-contact", label: "Contact" },
  { id: "backup", hash: "#admin-backup", label: "Backup" },
];

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
}

function newId() {
  if ("randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function linesToText(lines) {
  return lines.join("\n");
}

function textToLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdminPage() {
  const { content, status, error, refresh, setLocalContent } = useCms();

  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const adminKeyRef = useRef("");
  const unlockedRef = useRef(false);
  useEffect(() => {
    adminKeyRef.current = adminKey;
  }, [adminKey]);
  useEffect(() => {
    unlockedRef.current = unlocked;
  }, [unlocked]);

  // Restore session on refresh; clear session on SPA navigation away
  useEffect(() => {
    const stored = sessionStorage.getItem("renora_admin_key");
    if (stored) {
      setAdminKey(stored);
      setUnlocked(true);
    }
    const handleBeforeUnload = () => {
      if (unlockedRef.current) {
        sessionStorage.setItem("renora_admin_key", adminKeyRef.current);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sessionStorage.removeItem("renora_admin_key");
    };
  }, []);
  const [unlocking, setUnlocking] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isBackupLoading, setIsBackupLoading] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [isRestoreLoading, setIsRestoreLoading] = useState(false);
  const [isRestoreValidateLoading, setIsRestoreValidateLoading] =
    useState(false);

  const replaceStringsDeep = (value, replacer) => {
    if (typeof value === "string") return replacer(value);
    if (Array.isArray(value))
      return value.map((v) => replaceStringsDeep(v, replacer));
    if (value && typeof value === "object") {
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = replaceStringsDeep(v, replacer);
      }
      return out;
    }
    return value;
  };

  const applyMediaRenameLocally = (fromUrl, toUrl) => {
    setDraft((current) => {
      if (!current) return current;
      return replaceStringsDeep(current, (s) => (s === fromUrl ? toUrl : s));
    });

    if (content) {
      const next = replaceStringsDeep(content, (s) =>
        s === fromUrl ? toUrl : s,
      );
      setLocalContent(next);
    }
  };

  const [mediaPicker, setMediaPicker] = useState({ open: false });
  const [iconPicker, setIconPicker] = useState({ open: false });
  const [serviceEditor, setServiceEditor] = useState({ open: false });
  const [bannerEditor, setBannerEditor] = useState({ open: false });
  const [testimonialEditor, setTestimonialEditor] = useState({ open: false });
  const [aboutFeatureEditor, setAboutFeatureEditor] = useState({ open: false });
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const byHash = new Map(ADMIN_SECTIONS.map((s) => [s.hash, s.id]));
    const applyFromHash = () => {
      const next = byHash.get(window.location.hash);
      if (next) setActiveSection(next);
    };
    window.addEventListener("hashchange", applyFromHash);
    applyFromHash();
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, []);

  const goToSection = (section) => {
    const meta = ADMIN_SECTIONS.find((s) => s.id === section);
    setActiveSection(section);
    if (meta) {
      try {
        window.history.replaceState(null, "", meta.hash);
      } catch {
        // ignore
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  useEffect(() => {
    if (!unlocked) return;
    if (status === "loading") return;
    setDraft((prev) => prev ?? cloneContent(content));
  }, [unlocked, status, content]);

  const lock = () => {
    sessionStorage.removeItem("renora_admin_key");
    setUnlocked(false);
    setAdminKey("");
    setDraft(null);
    setMessage(null);
  };

  const unlock = async () => {
    setMessage(null);
    const key = adminKey.trim();
    console.log(key);

    if (!key) {
      setMessage("Enter the admin passcode.");
      return;
    }

    setUnlocking(true);
    try {
      const response = await fetch("/api/admin/verify", {
        headers: {
          "x-admin-key": key,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Wrong passcode.");
        }
        const text = await response.text().catch(() => "");
        throw new Error(text || `Unlock failed: ${response.status}`);
      }

      sessionStorage.setItem("renora_admin_key", key);
      setUnlocked(true);
    } catch (err) {
      setUnlocked(false);
      setMessage(err instanceof Error ? err.message : "Unlock failed");
    } finally {
      setUnlocking(false);
    }
  };

  const save = async () => {
    if (!draft) return;

    setMessage(null);
    setSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: check your admin passcode.");
        }
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json().catch(() => null);
          const msg = [data?.error, data?.hint].filter(Boolean).join(" ");
          throw new Error(msg || `Save failed: ${response.status}`);
        }
        const text = await response.text().catch(() => "");
        throw new Error(text || `Save failed: ${response.status}`);
      }

      setLocalContent(draft);
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reload = async () => {
    setMessage(null);
    try {
      const response = await fetch("/api/content");
      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json().catch(() => null);
          const msg = [data?.error, data?.hint].filter(Boolean).join(" ");
          throw new Error(msg || `Reload failed: ${response.status}`);
        }
        const text = await response.text().catch(() => "");
        throw new Error(text || `Reload failed: ${response.status}`);
      }
      const next = await response.json();
      setLocalContent(next);
      setDraft(cloneContent(next));
      setMessage("Reloaded from server.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Reload failed");
      await refresh();
    }
  };

  const downloadBackup = async () => {
    setMessage(null);
    setIsBackupLoading(true);
    try {
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || `Backup failed: ${response.status}`);
        }
        const text = await response.text().catch(() => "");
        throw new Error(text || `Backup failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Renora export.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage("Backup downloaded.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Backup failed");
    } finally {
      setIsBackupLoading(false);
    }
  };

  const restoreFromBackup = async () => {
    if (!restoreFile) {
      setMessage("Choose a backup ZIP file first.");
      return;
    }

    const confirmed = window.confirm(
      "Restore will REPLACE the database and uploads using the ZIP contents. Continue?",
    );
    if (!confirmed) return;

    setMessage(null);
    setIsRestoreLoading(true);
    try {
      const form = new FormData();
      form.append("file", restoreFile);

      const response = await fetch("/api/restore", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
        body: form,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || `Restore failed: ${response.status}`);
        }
        const text = await response.text().catch(() => "");
        throw new Error(text || `Restore failed: ${response.status}`);
      }

      const data = await response.json().catch(() => null);
      const count =
        typeof data?.restoredFiles === "number" ? data.restoredFiles : 0;
      setMessage(`Restore completed. Restored ${count} upload file(s).`);
      setRestoreFile(null);
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Restore failed");
    } finally {
      setIsRestoreLoading(false);
    }
  };

  const validateRestoreZip = async () => {
    if (!restoreFile) {
      setMessage("Choose a backup ZIP file first.");
      return;
    }

    setMessage(null);
    setIsRestoreValidateLoading(true);
    try {
      const form = new FormData();
      form.append("file", restoreFile);

      const response = await fetch("/api/restore/validate", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
        body: form,
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : null;

      if (!response.ok) {
        const errorMsg = data?.error
          ? String(data.error)
          : `Validation failed: ${response.status}`;
        throw new Error(errorMsg);
      }

      const dumpKb =
        typeof data?.dumpBytes === "number"
          ? Math.round(data.dumpBytes / 1024)
          : 0;
      const uploadFiles =
        typeof data?.uploadFiles === "number" ? data.uploadFiles : 0;
      const unsafe =
        typeof data?.unsafeEntries === "number" ? data.unsafeEntries : 0;
      const invalidNames =
        typeof data?.invalidUploadNames === "number"
          ? data.invalidUploadNames
          : 0;
      const ignored =
        typeof data?.ignoredEntries === "number" ? data.ignoredEntries : 0;

      setMessage(
        `Backup ZIP looks valid. DB/dump.sql: ~${dumpKb}KB. Upload files: ${uploadFiles}. Ignored: ${ignored}. Unsafe: ${unsafe}. Invalid upload names: ${invalidNames}.`,
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setIsRestoreValidateLoading(false);
    }
  };

  const openMediaPicker = (onSelect, autoSelectOnUpload) => {
    setMediaPicker({ open: true, onSelect, autoSelectOnUpload });
  };

  const openIconPicker = (opts) => {
    setIconPicker({ open: true, ...opts });
  };

  const updateBannerEditorValue = (nextValue) => {
    if (!bannerEditor.open) return;
    setBannerEditor({ ...bannerEditor, value: nextValue });
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.banners];
      next[bannerEditor.index] = nextValue;
      return { ...prev, banners: next };
    });
  };

  const cancelBannerEditor = () => {
    if (!bannerEditor.open) return;
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.banners];
      next[bannerEditor.index] = bannerEditor.original;
      return { ...prev, banners: next };
    });
    setBannerEditor({ open: false });
  };

  const updateServiceEditorValue = (nextValue) => {
    if (!serviceEditor.open) return;
    setServiceEditor({ ...serviceEditor, value: nextValue });
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.services];
      next[serviceEditor.index] = nextValue;
      return { ...prev, services: next };
    });
  };

  const cancelServiceEditor = () => {
    if (!serviceEditor.open) return;
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.services];
      next[serviceEditor.index] = serviceEditor.original;
      return { ...prev, services: next };
    });
    setServiceEditor({ open: false });
  };

  const ImagePicker = ({ label, value, onChange, className }) => (
    <div className={"space-y-2 " + (className || "")}>
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          className="border-[var(--button-outline-border)]"
          onClick={() => openMediaPicker(onChange, true)}
        >
          Choose / Upload
        </Button>
      </div>
      <div className="rounded-md border border-[rgb(var(--renora-accent-rgb)/0.15)] overflow-hidden bg-white">
        {value ? (
          <img
            src={value}
            alt="Selected"
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-[var(--muted-foreground)]">
            No image selected
          </div>
        )}
      </div>
      {value ? (
        <p className="text-xs text-[var(--muted-foreground)] break-all">
          {value}
        </p>
      ) : null}
    </div>
  );

  const setAboutImage = (index, url) => {
    const fallback = ["", "", "", ""];
    const current = Array.isArray(draft?.settings.about.images)
      ? draft.settings.about.images
      : fallback;

    const next = [...current];
    while (next.length < 4) next.push("");
    next[index] = url;

    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          about: {
            ...prev.settings.about,
            images: next,
          },
        },
      };
    });
  };

  if (!unlocked) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-xl">
          <Card className="border-[rgb(var(--renora-accent-rgb)/0.2)]">
            <CardHeader>
              <CardTitle className="text-[var(--primary)]">Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") unlock();
                  }}
                  placeholder="Enter passcode"
                />
              </div>
              {message ? (
                <p className="text-sm text-red-700">{message}</p>
              ) : null}
              <Button
                onClick={unlock}
                disabled={unlocking}
                className="bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)] w-full"
              >
                {unlocking ? "Verifying..." : "Unlock"}
              </Button>
              <p className="text-xs text-[var(--muted-foreground)]">
                This passcode is checked server-side via the `ADMIN_KEY` env
                var.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl text-[var(--primary)]">Admin</h2>
            <Button
              variant="outline"
              className="border-[var(--button-outline-border)]"
              onClick={lock}
            >
              Lock
            </Button>
          </div>
          <p className="mt-6 text-[var(--muted-foreground)]">
            Loading content...
          </p>
        </div>
      </div>
    );
  }

  const visibleStatus =
    status === "error" ? `Error: ${error ?? "Unknown"}` : status;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl text-[var(--primary)]">Admin</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              CMS status: {visibleStatus}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={reload}>
              Reload
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={lock}>
              Lock
            </Button>
          </div>
        </div>

        {message ? (
          <p className="mb-6 text-sm text-[var(--primary)]">{message}</p>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:hidden">
            <div className="space-y-2">
              <Label>Section</Label>
              <Select
                value={activeSection}
                onValueChange={(value) => goToSection(value)}
              >
                <SelectTrigger className="border-[rgb(var(--renora-accent-rgb)/0.3)]">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_SECTIONS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <aside className="hidden lg:block">
            <Card className="border-[rgb(var(--renora-accent-rgb)/0.2)] sticky top-24">
              <CardHeader>
                <CardTitle className="text-[var(--primary)] text-base">
                  Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {ADMIN_SECTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className={
                      "block w-full text-left rounded-md px-3 py-2 text-sm text-[var(--primary)] hover:bg-[rgb(var(--renora-accent-hover-rgb)/0.1)] " +
                      (item.id === activeSection
                        ? "bg-[rgb(var(--renora-accent-rgb)/0.1)]"
                        : "")
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </CardContent>
            </Card>
          </aside>

          <div>
            {/* Hero */}
            {activeSection === "hero" ? (
              <Card
                id="admin-hero"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">Hero</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImagePicker
                    label="Hero background image"
                    value={draft.settings.hero.backgroundImage}
                    onChange={(url) =>
                      setDraft({
                        ...draft,
                        settings: {
                          ...draft.settings,
                          hero: {
                            ...draft.settings.hero,
                            backgroundImage: url,
                          },
                        },
                      })
                    }
                    className="md:col-span-2"
                  />
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input
                      value={draft.settings.hero.badge}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              badge: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <TextStyleControls
                      style={draft.settings.hero.badgeStyle}
                      onChange={(newStyle) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              badgeStyle: newStyle,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Headline (line 1)</Label>
                    <Input
                      value={draft.settings.hero.headline}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              headline: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <TextStyleControls
                      style={draft.settings.hero.headlineStyle}
                      onChange={(newStyle) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              headlineStyle: newStyle,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlight (line 2)</Label>
                    <Input
                      value={draft.settings.hero.highlight}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              highlight: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <TextStyleControls
                      style={draft.settings.hero.highlightStyle}
                      onChange={(newStyle) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              highlightStyle: newStyle,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Subheadline</Label>
                    <Textarea
                      value={draft.settings.hero.subheadline}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              subheadline: e.target.value,
                            },
                          },
                        })
                      }
                      rows={3}
                    />
                    <TextStyleControls
                      style={draft.settings.hero.subheadlineStyle}
                      onChange={(newStyle) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            hero: {
                              ...draft.settings.hero,
                              subheadlineStyle: newStyle,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-[var(--primary)] mb-2">Stats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {draft.settings.hero.stats.map((stat, idx) => (
                        <div key={idx} className="space-y-2">
                          <Input
                            value={stat.value}
                            onChange={(e) => {
                              const stats = [...draft.settings.hero.stats];
                              stats[idx] = {
                                ...stats[idx],
                                value: e.target.value,
                              };
                              setDraft({
                                ...draft,
                                settings: {
                                  ...draft.settings,
                                  hero: { ...draft.settings.hero, stats },
                                },
                              });
                            }}
                            placeholder="Value (e.g. 500+)"
                          />
                          <Input
                            value={stat.label}
                            onChange={(e) => {
                              const stats = [...draft.settings.hero.stats];
                              stats[idx] = {
                                ...stats[idx],
                                label: e.target.value,
                              };
                              setDraft({
                                ...draft,
                                settings: {
                                  ...draft.settings,
                                  hero: { ...draft.settings.hero, stats },
                                },
                              });
                            }}
                            placeholder="Label (e.g. Happy Clients)"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Media */}
            {activeSection === "media" ? (
              <Card
                id="admin-media"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Upload images once, then reuse them anywhere in the site.
                  </p>
                  <MediaLibraryPanel
                    active={activeSection === "media"}
                    adminKey={adminKey}
                    enableManage
                    mobileSingleColumn
                    onRenamed={({ fromUrl, toUrl, updatedReferences }) => {
                      applyMediaRenameLocally(fromUrl, toUrl);
                      setMessage(
                        updatedReferences > 0
                          ? `Renamed file and updated ${updatedReferences} reference(s) in site content.`
                          : "Renamed file.",
                      );
                    }}
                  />
                </CardContent>
              </Card>
            ) : null}

            {/* Colors */}
            {activeSection === "colors" ? (
              <Card
                id="admin-colors"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">
                    Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["Accent", "accent"],
                    ["Accent hover", "accentHover"],
                    ["Background", "background"],
                    ["Foreground", "foreground"],
                    ["Primary (buttons, footer, gradients)", "primary"],
                    [
                      "Primary foreground (button/footer text)",
                      "primaryForeground",
                    ],
                    ["Muted", "muted"],
                    ["Muted foreground", "mutedForeground"],
                    ["Card", "card"],
                    ["Card foreground", "cardForeground"],
                    ["Card border", "cardBorder"],
                    ["Card border hover", "cardBorderHover"],
                    ["Icon primary", "iconPrimary"],
                    ["Icon on accent backgrounds", "iconOnAccent"],
                    ["Icon accent", "iconAccent"],
                    ["Icon accent soft", "iconAccentSoft"],
                    ["Form label text", "formLabelText"],
                    ["Form input text", "formInputText"],
                    ["Form input border", "formInputBorder"],
                    ["Form input focus border", "formInputFocusBorder"],
                    ["Input background", "inputBackground"],
                    ["Nav link text", "navLinkText"],
                    ["Nav link hover", "navLinkHover"],
                    ["Nav button background", "navButtonBg"],
                    ["Nav button hover background", "navButtonHoverBg"],
                    ["Nav button text", "navButtonText"],
                    ["Badge text (all sections)", "badgeText"],
                    ["Badge background (all sections)", "badgeBg"],
                    ["Button - Default background", "buttonDefaultBg"],
                    [
                      "Button - Default hover background",
                      "buttonDefaultHoverBg",
                    ],
                    ["Button - Default text", "buttonDefaultText"],
                    ["Button - Secondary background", "buttonSecondaryBg"],
                    [
                      "Button - Secondary hover background",
                      "buttonSecondaryHoverBg",
                    ],
                    ["Button - Secondary text", "buttonSecondaryText"],
                    ["Button - Destructive background", "buttonDestructiveBg"],
                    [
                      "Button - Destructive hover background",
                      "buttonDestructiveHoverBg",
                    ],
                    ["Button - Destructive text", "buttonDestructiveText"],
                    ["Button - Outline border", "buttonOutlineBorder"],
                    [
                      "Button - Outline hover border",
                      "buttonOutlineHoverBorder",
                    ],
                    ["Button - Outline text", "buttonOutlineText"],
                    [
                      "Button - Outline hover background",
                      "buttonOutlineHoverBg",
                    ],
                    ["Button - Ghost text", "buttonGhostText"],
                    ["Button - Ghost hover background", "buttonGhostHoverBg"],
                    ["CTA button background", "ctaButtonBg"],
                    ["CTA button hover background", "ctaButtonHoverBg"],
                    ["CTA button text", "ctaButtonText"],
                    ["Outline button border", "outlineButtonBorder"],
                    ["Outline button text", "outlineButtonText"],
                    ["Outline button hover background", "outlineButtonHoverBg"],
                    ["Outline button hover text", "outlineButtonHoverText"],
                    ["Hero image overlay", "heroOverlay"],
                    ["Promo image overlay", "promoOverlay"],
                    ["Image overlay heading text", "imageOverlayText"],
                    ["Image overlay body text", "imageOverlayMutedText"],
                    ["Image overlay panel background", "imageOverlayPanelBg"],
                    ["Image overlay panel border", "imageOverlayPanelBorder"],
                    ["Promo shine color", "promoShine"],
                    ["Section base background", "surfaceBase"],
                    ["Elevated panel background", "surfaceElevated"],
                    ["Soft elevated panel background", "surfaceElevatedSoft"],
                    [
                      "Soft elevated panel hover background",
                      "surfaceElevatedHover",
                    ],
                    ["Footer background", "footerBackground"],
                    ["Footer muted text", "footerMutedText"],
                    ["Footer heading", "footerHeading"],
                    ["Footer link hover", "footerLinkHover"],
                    ["Footer social button background", "footerSocialBg"],
                    [
                      "Footer social button hover background",
                      "footerSocialHoverBg",
                    ],
                    ["Footer social icon", "footerSocialIcon"],
                    ["Footer social icon hover", "footerSocialIconHover"],
                    ["Before/After handle border", "beforeAfterHandleBorder"],
                    ["Before/After handle icon", "beforeAfterHandleIcon"],
                    ["Before/After label background", "beforeAfterLabelBg"],
                    ["Before/After label text", "beforeAfterLabelText"],
                  ].map(([label, key]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <RgbaColorPicker
                        value={draft.settings.theme[key] ?? ""}
                        onChange={(val) => {
                          const next = {
                            ...draft,
                            settings: {
                              ...draft.settings,
                              theme: {
                                ...draft.settings.theme,
                                [key]: val,
                              },
                            },
                          };
                          setDraft(next);
                          setLocalContent(next);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {/* Promo Banners */}
            {activeSection === "banners" ? (
              <Card
                id="admin-banners"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">
                    Promo Banners
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      If more than one banner is active, the home page shows a
                      carousel.
                    </p>
                    <Button
                      variant="outline"
                      className="border-[var(--button-outline-border)]"
                      onClick={() => {
                        setDraft({
                          ...draft,
                          banners: [
                            ...draft.banners,
                            {
                              id: newId(),
                              badge: "New",
                              title: "New promotion",
                              description: "",
                              ctaLabel: "Learn more",
                              ctaHref: "/#contact",
                              image:
                                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
                              active: false,
                            },
                          ],
                        });
                      }}
                    >
                      Add Banner
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {draft.banners.map((banner, idx) => (
                      <Card
                        key={banner.id}
                        className="border-[rgb(var(--renora-accent-rgb)/0.15)]"
                      >
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-sm text-[var(--primary)] font-medium">
                              {banner.title || "(Untitled)"}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {banner.badge || ""}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Label>Active</Label>
                              <Switch
                                checked={banner.active}
                                onCheckedChange={(checked) => {
                                  const next = [...draft.banners];
                                  next[idx] = { ...next[idx], active: checked };
                                  setDraft({ ...draft, banners: next });
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const value = JSON.parse(
                                    JSON.stringify(draft.banners[idx]),
                                  );
                                  const original = JSON.parse(
                                    JSON.stringify(value),
                                  );
                                  setBannerEditor({
                                    open: true,
                                    index: idx,
                                    value,
                                    original,
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const next = [...draft.banners];
                                  next.splice(idx, 1);
                                  setDraft({ ...draft, banners: next });
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Dialog
                    open={bannerEditor.open}
                    onOpenChange={(open) => {
                      if (!open) cancelBannerEditor();
                    }}
                  >
                    {bannerEditor.open ? (
                      <DialogContent className="sm:max-w-7xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Banner</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Badge</Label>
                            <Input
                              value={bannerEditor.value.badge}
                              onChange={(e) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  badge: e.target.value,
                                })
                              }
                            />
                            <TextStyleControls
                              style={bannerEditor.value.badgeStyle}
                              onChange={(newStyle) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  badgeStyle: newStyle,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CTA Label</Label>
                            <Input
                              value={bannerEditor.value.ctaLabel}
                              onChange={(e) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  ctaLabel: e.target.value,
                                })
                              }
                            />
                            <TextStyleControls
                              style={bannerEditor.value.ctaLabelStyle}
                              onChange={(newStyle) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  ctaLabelStyle: newStyle,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Title</Label>
                            <Input
                              value={bannerEditor.value.title}
                              onChange={(e) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  title: e.target.value,
                                })
                              }
                            />
                            <TextStyleControls
                              style={bannerEditor.value.titleStyle}
                              onChange={(newStyle) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  titleStyle: newStyle,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              value={bannerEditor.value.description}
                              onChange={(e) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                            />
                            <TextStyleControls
                              style={bannerEditor.value.descriptionStyle}
                              onChange={(newStyle) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  descriptionStyle: newStyle,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CTA Href</Label>
                            <Input
                              value={bannerEditor.value.ctaHref}
                              onChange={(e) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  ctaHref: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Active</Label>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={bannerEditor.value.active}
                                onCheckedChange={(checked) =>
                                  updateBannerEditorValue({
                                    ...bannerEditor.value,
                                    active: checked,
                                  })
                                }
                              />
                              <span className="text-sm text-[var(--muted-foreground)]">
                                {bannerEditor.value.active
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <ImagePicker
                              label="Image"
                              value={bannerEditor.value.image}
                              onChange={(url) =>
                                updateBannerEditorValue({
                                  ...bannerEditor.value,
                                  image: url,
                                })
                              }
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            className="border-[var(--button-outline-border)]"
                            onClick={cancelBannerEditor}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)]"
                            onClick={() => setBannerEditor({ open: false })}
                          >
                            Apply
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    ) : null}
                  </Dialog>
                </CardContent>
              </Card>
            ) : null}

            {/* Services */}
            {activeSection === "services" ? (
              <Card
                id="admin-services"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[var(--primary)]">Section Heading</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Badge</Label>
                        <Input
                          value={draft.settings.sections.services.badge}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  services: {
                                    ...draft.settings.sections.services,
                                    badge: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={draft.settings.sections.services.badgeStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  services: {
                                    ...draft.settings.sections.services,
                                    badgeStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={draft.settings.sections.services.title}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  services: {
                                    ...draft.settings.sections.services,
                                    title: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={draft.settings.sections.services.titleStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  services: {
                                    ...draft.settings.sections.services,
                                    titleStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={draft.settings.sections.services.subtitle}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  services: {
                                    ...draft.settings.sections.services,
                                    subtitle: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                          rows={2}
                        />
                        <TextStyleControls
                          style={draft.settings.sections.services.subtitleStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  services: {
                                    ...draft.settings.sections.services,
                                    subtitleStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Add, edit, delete, or hide services.
                    </p>
                    <Button
                      variant="outline"
                      className="border-[var(--button-outline-border)]"
                      onClick={() => {
                        const title = "New Service";
                        const slug = slugify(title) || newId();
                        const next = {
                          id: newId(),
                          slug,
                          iconKey: "Sparkles",
                          title,
                          summary: "",
                          image:
                            "https://images.unsplash.com/photo-1763705857707-48bbfb24bbd3?auto=format&fit=crop&w=1600&q=80",
                          overview: "",
                          included: [],
                          idealFor: [],
                          showOnHome: false,
                          homeOrder: undefined,
                          hidden: true,
                        };
                        setDraft({
                          ...draft,
                          services: [...draft.services, next],
                        });
                      }}
                    >
                      Add Service
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {draft.services.map((service, idx) => (
                      <Card
                        key={service.id}
                        className="border-[rgb(var(--renora-accent-rgb)/0.15)]"
                      >
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm text-[var(--primary)] font-medium">
                                {service.title || "(Untitled)"}
                              </p>
                              {typeof service.homeOrder === "number" &&
                              service.homeOrder >= 1 &&
                              service.homeOrder <= 3 ? (
                                <span className="text-xs px-2 py-0.5 rounded-full border border-[rgb(var(--renora-accent-rgb)/0.4)] bg-[rgb(var(--renora-accent-rgb)/0.1)] text-[var(--primary)]">
                                  Home #{service.homeOrder}
                                </span>
                              ) : null}
                            </div>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              /services/{service.slug}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Label>Active</Label>
                              <Switch
                                checked={!service.hidden}
                                onCheckedChange={(checked) => {
                                  const next = [...draft.services];
                                  next[idx] = {
                                    ...next[idx],
                                    hidden: !checked,
                                    showOnHome: checked
                                      ? next[idx].showOnHome
                                      : false,
                                    homeOrder: checked
                                      ? next[idx].homeOrder
                                      : undefined,
                                  };
                                  setDraft({ ...draft, services: next });
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label>Home</Label>
                              <Select
                                value={
                                  typeof service.homeOrder === "number" &&
                                  service.homeOrder >= 1 &&
                                  service.homeOrder <= 3
                                    ? String(service.homeOrder)
                                    : "0"
                                }
                                onValueChange={(value) => {
                                  const parsed = Number.parseInt(value, 10);
                                  const nextOrder = Number.isFinite(parsed)
                                    ? parsed
                                    : 0;

                                  if (nextOrder >= 1 && nextOrder <= 3) {
                                    const occupiedBy = draft.services.find(
                                      (s, index) =>
                                        index !== idx &&
                                        !s.hidden &&
                                        s.homeOrder === nextOrder,
                                    );
                                    if (occupiedBy) {
                                      setMessage(
                                        `Home #${nextOrder} is already assigned to "${occupiedBy.title || "(Untitled)"}".`,
                                      );
                                      return;
                                    }
                                  }

                                  const next = [...draft.services];
                                  next[idx] = {
                                    ...next[idx],
                                    homeOrder:
                                      nextOrder >= 1 && nextOrder <= 3
                                        ? nextOrder
                                        : undefined,
                                    showOnHome:
                                      nextOrder >= 1 && nextOrder <= 3,
                                    hidden:
                                      nextOrder >= 1 && nextOrder <= 3
                                        ? false
                                        : next[idx].hidden,
                                  };
                                  setDraft({ ...draft, services: next });
                                }}
                              >
                                <SelectTrigger className="h-9 w-[140px] border-[rgb(var(--renora-accent-rgb)/0.3)]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">Not on home</SelectItem>
                                  <SelectItem value="1">Home #1</SelectItem>
                                  <SelectItem value="2">Home #2</SelectItem>
                                  <SelectItem value="3">Home #3</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const value = JSON.parse(
                                    JSON.stringify(draft.services[idx]),
                                  );
                                  const original = JSON.parse(
                                    JSON.stringify(value),
                                  );
                                  setServiceEditor({
                                    open: true,
                                    index: idx,
                                    value,
                                    original,
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const next = [...draft.services];
                                  next.splice(idx, 1);
                                  setDraft({ ...draft, services: next });
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Dialog
                    open={serviceEditor.open}
                    onOpenChange={(open) => {
                      if (!open) cancelServiceEditor();
                    }}
                  >
                    {serviceEditor.open ? (
                      <DialogContent className="sm:max-w-7xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Service</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={serviceEditor.value.title}
                              onChange={(e) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  title: e.target.value,
                                })
                              }
                            />
                            <TextStyleControls
                              style={serviceEditor.value.titleStyle}
                              onChange={(newStyle) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  titleStyle: newStyle,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input
                              value={serviceEditor.value.slug}
                              onChange={(e) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  slug: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Icon</Label>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-start gap-2 border-[rgb(var(--renora-accent-rgb)/0.3)]"
                              onClick={() =>
                                openIconPicker({
                                  title: "Choose service icon",
                                  value: serviceEditor.value.iconKey,
                                  onSelect: (iconKey) =>
                                    updateServiceEditorValue({
                                      ...serviceEditor.value,
                                      iconKey,
                                    }),
                                })
                              }
                            >
                              {(() => {
                                const Icon = iconComponentFromKey(
                                  serviceEditor.value.iconKey,
                                );
                                return Icon ? (
                                  <Icon className="h-4 w-4" aria-hidden />
                                ) : null;
                              })()}
                              <span className="truncate">
                                {serviceEditor.value.iconKey || "Select icon"}
                              </span>
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Active</Label>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={!serviceEditor.value.hidden}
                                onCheckedChange={(checked) =>
                                  updateServiceEditorValue({
                                    ...serviceEditor.value,
                                    hidden: !checked,
                                    showOnHome: checked
                                      ? serviceEditor.value.showOnHome
                                      : false,
                                    homeOrder: checked
                                      ? serviceEditor.value.homeOrder
                                      : undefined,
                                  })
                                }
                              />
                              <span className="text-sm text-[var(--muted-foreground)]">
                                {serviceEditor.value.hidden
                                  ? "Hidden"
                                  : "Visible"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Home order (max 3)</Label>
                            <Select
                              value={
                                typeof serviceEditor.value.homeOrder ===
                                "number"
                                  ? String(serviceEditor.value.homeOrder)
                                  : "0"
                              }
                              onValueChange={(value) => {
                                const parsed = Number.parseInt(value, 10);
                                const nextOrder = Number.isFinite(parsed)
                                  ? parsed
                                  : 0;

                                if (nextOrder >= 1 && nextOrder <= 3) {
                                  const occupiedBy = draft.services.find(
                                    (service, index) =>
                                      index !== serviceEditor.index &&
                                      !service.hidden &&
                                      service.homeOrder === nextOrder,
                                  );
                                  if (occupiedBy) {
                                    setMessage(
                                      `Home #${nextOrder} is already assigned to "${occupiedBy.title || "(Untitled)"}".`,
                                    );
                                    return;
                                  }
                                }

                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  homeOrder:
                                    nextOrder >= 1 && nextOrder <= 3
                                      ? nextOrder
                                      : undefined,
                                  showOnHome: nextOrder >= 1 && nextOrder <= 3,
                                  hidden:
                                    nextOrder >= 1 && nextOrder <= 3
                                      ? false
                                      : serviceEditor.value.hidden,
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Not on home" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Not on home</SelectItem>
                                <SelectItem value="1">Home #1</SelectItem>
                                <SelectItem value="2">Home #2</SelectItem>
                                <SelectItem value="3">Home #3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Summary</Label>
                            <Textarea
                              value={serviceEditor.value.summary}
                              onChange={(e) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  summary: e.target.value,
                                })
                              }
                              rows={2}
                            />
                            <TextStyleControls
                              style={serviceEditor.value.summaryStyle}
                              onChange={(newStyle) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  summaryStyle: newStyle,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <ImagePicker
                              label="Image"
                              value={serviceEditor.value.image}
                              onChange={(url) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  image: url,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Overview</Label>
                            <Textarea
                              value={serviceEditor.value.overview}
                              onChange={(e) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  overview: e.target.value,
                                })
                              }
                              rows={3}
                            />
                            <TextStyleControls
                              style={serviceEditor.value.overviewStyle}
                              onChange={(newStyle) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  overviewStyle: newStyle,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Included (one per line)</Label>
                            <Textarea
                              value={linesToText(serviceEditor.value.included)}
                              onChange={(e) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  included: textToLines(e.target.value),
                                })
                              }
                              rows={6}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Ideal For (one per line)</Label>
                            <Textarea
                              value={linesToText(serviceEditor.value.idealFor)}
                              onChange={(e) =>
                                updateServiceEditorValue({
                                  ...serviceEditor.value,
                                  idealFor: textToLines(e.target.value),
                                })
                              }
                              rows={6}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            className="border-[var(--button-outline-border)]"
                            onClick={cancelServiceEditor}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)]"
                            onClick={() => setServiceEditor({ open: false })}
                          >
                            Apply
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    ) : null}
                  </Dialog>
                </CardContent>
              </Card>
            ) : null}

            {/* Before / After */}
            {activeSection === "beforeAfter" ? (
              <Card
                id="admin-before-after"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">
                    Before / After
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between gap-3 rounded-md border border-[rgb(var(--renora-accent-rgb)/0.15)] bg-white p-3">
                    <div>
                      <p className="text-sm text-[var(--primary)] font-medium">
                        Hide section
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        If hidden, Before / After will not appear on the
                        homepage.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Boolean(
                          draft.settings.sections.beforeAfter.hidden,
                        )}
                        onCheckedChange={(checked) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              sections: {
                                ...draft.settings.sections,
                                beforeAfter: {
                                  ...draft.settings.sections.beforeAfter,
                                  hidden: checked,
                                },
                              },
                            },
                          })
                        }
                      />
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {draft.settings.sections.beforeAfter.hidden
                          ? "Hidden"
                          : "Visible"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[var(--primary)]">Section Heading</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Badge</Label>
                        <Input
                          value={draft.settings.sections.beforeAfter.badge}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  beforeAfter: {
                                    ...draft.settings.sections.beforeAfter,
                                    badge: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={draft.settings.sections.beforeAfter.badgeStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  beforeAfter: {
                                    ...draft.settings.sections.beforeAfter,
                                    badgeStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={draft.settings.sections.beforeAfter.title}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  beforeAfter: {
                                    ...draft.settings.sections.beforeAfter,
                                    title: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={draft.settings.sections.beforeAfter.titleStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  beforeAfter: {
                                    ...draft.settings.sections.beforeAfter,
                                    titleStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={draft.settings.sections.beforeAfter.subtitle}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  beforeAfter: {
                                    ...draft.settings.sections.beforeAfter,
                                    subtitle: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[var(--primary)]">Images & Labels</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImagePicker
                        label="Before image"
                        value={draft.settings.beforeAfter.beforeImage}
                        onChange={(url) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              beforeAfter: {
                                ...draft.settings.beforeAfter,
                                beforeImage: url,
                              },
                            },
                          })
                        }
                      />
                      <ImagePicker
                        label="After image"
                        value={draft.settings.beforeAfter.afterImage}
                        onChange={(url) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              beforeAfter: {
                                ...draft.settings.beforeAfter,
                                afterImage: url,
                              },
                            },
                          })
                        }
                      />
                      {[
                        ["Before Label", "beforeLabel"],
                        ["After Label", "afterLabel"],
                        ["Before Alt Text", "beforeAlt"],
                        ["After Alt Text", "afterAlt"],
                      ].map(([label, key]) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <Input
                            value={draft.settings.beforeAfter[key]}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                settings: {
                                  ...draft.settings,
                                  beforeAfter: {
                                    ...draft.settings.beforeAfter,
                                    [key]: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <MediaLibraryDialog
              open={mediaPicker.open}
              adminKey={adminKey}
              autoSelectOnUpload={
                mediaPicker.open ? mediaPicker.autoSelectOnUpload : false
              }
              onOpenChange={(open) => {
                if (!open) setMediaPicker({ open: false });
              }}
              onSelect={(url) => {
                if (mediaPicker.open) mediaPicker.onSelect(url);
              }}
            />

            <IconPickerDialog
              open={iconPicker.open}
              value={iconPicker.open ? iconPicker.value : undefined}
              title={iconPicker.open ? iconPicker.title : undefined}
              onOpenChange={(open) => {
                if (!open) setIconPicker({ open: false });
              }}
              onSelect={(iconKey) => {
                if (iconPicker.open) iconPicker.onSelect(iconKey);
              }}
            />

            {/* About */}
            {activeSection === "about" ? (
              <Card
                id="admin-about"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-3 rounded-md border border-[rgb(var(--renora-accent-rgb)/0.15)] bg-white p-3">
                    <div>
                      <p className="text-sm text-[var(--primary)] font-medium">
                        Hide section
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        If hidden, About will not appear on the homepage.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Boolean(draft.settings.about.hidden)}
                        onCheckedChange={(checked) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              about: {
                                ...draft.settings.about,
                                hidden: checked,
                              },
                            },
                          })
                        }
                      />
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {draft.settings.about.hidden ? "Hidden" : "Visible"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Badge</Label>
                      <Input
                        value={draft.settings.about.badge}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              about: {
                                ...draft.settings.about,
                                badge: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <TextStyleControls
                        style={draft.settings.about.badgeStyle}
                        onChange={(newStyle) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              about: {
                                ...draft.settings.about,
                                badgeStyle: newStyle,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={draft.settings.about.title}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              about: {
                                ...draft.settings.about,
                                title: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <TextStyleControls
                        style={draft.settings.about.titleStyle}
                        onChange={(newStyle) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              about: {
                                ...draft.settings.about,
                                titleStyle: newStyle,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Paragraphs (one per line)</Label>
                    <Textarea
                      value={linesToText(draft.settings.about.paragraphs)}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            about: {
                              ...draft.settings.about,
                              paragraphs: textToLines(e.target.value),
                            },
                          },
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[var(--primary)]">Images</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <ImagePicker
                          key={i}
                          label={`About image ${i + 1}`}
                          value={draft.settings.about.images?.[i] ?? ""}
                          onChange={(url) => setAboutImage(i, url)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="text-[var(--primary)]">Features</h4>
                      <Button
                        variant="outline"
                        className="border-[var(--button-outline-border)]"
                        onClick={() => {
                          const next = {
                            iconKey: "Shield",
                            title: "New Feature",
                            description: "",
                          };
                          const features = [
                            ...draft.settings.about.features,
                            next,
                          ];
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              about: { ...draft.settings.about, features },
                            },
                          });
                          setAboutFeatureEditor({
                            open: true,
                            index: features.length - 1,
                            value: JSON.parse(JSON.stringify(next)),
                          });
                        }}
                      >
                        Add Feature
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {draft.settings.about.features.map((feature, idx) => (
                        <Card
                          key={idx}
                          className="border-[rgb(var(--renora-accent-rgb)/0.15)]"
                        >
                          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <p className="text-sm text-[var(--primary)] font-medium">
                                {feature.title || `Feature ${idx + 1}`}
                              </p>
                              <p className="text-xs text-[var(--muted-foreground)]">
                                {feature.iconKey}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const value = JSON.parse(
                                    JSON.stringify(
                                      draft.settings.about.features[idx],
                                    ),
                                  );
                                  setAboutFeatureEditor({
                                    open: true,
                                    index: idx,
                                    value,
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const next = [
                                    ...draft.settings.about.features,
                                  ];
                                  next.splice(idx, 1);
                                  setDraft({
                                    ...draft,
                                    settings: {
                                      ...draft.settings,
                                      about: {
                                        ...draft.settings.about,
                                        features: next,
                                      },
                                    },
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Dialog
                      open={aboutFeatureEditor.open}
                      onOpenChange={(open) => {
                        if (!open) setAboutFeatureEditor({ open: false });
                      }}
                    >
                      {aboutFeatureEditor.open ? (
                        <DialogContent className="sm:max-w-7xl">
                          <DialogHeader>
                            <DialogTitle>Edit Feature</DialogTitle>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Icon</Label>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start gap-2 border-[rgb(var(--renora-accent-rgb)/0.3)]"
                                onClick={() =>
                                  openIconPicker({
                                    title: "Choose feature icon",
                                    value: aboutFeatureEditor.value.iconKey,
                                    onSelect: (iconKey) =>
                                      setAboutFeatureEditor({
                                        ...aboutFeatureEditor,
                                        value: {
                                          ...aboutFeatureEditor.value,
                                          iconKey,
                                        },
                                      }),
                                  })
                                }
                              >
                                {(() => {
                                  const Icon = iconComponentFromKey(
                                    aboutFeatureEditor.value.iconKey,
                                  );
                                  return Icon ? (
                                    <Icon className="h-4 w-4" aria-hidden />
                                  ) : null;
                                })()}
                                <span className="truncate">
                                  {aboutFeatureEditor.value.iconKey ||
                                    "Select icon"}
                                </span>
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={aboutFeatureEditor.value.title}
                                onChange={(e) =>
                                  setAboutFeatureEditor({
                                    ...aboutFeatureEditor,
                                    value: {
                                      ...aboutFeatureEditor.value,
                                      title: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={aboutFeatureEditor.value.description}
                                onChange={(e) =>
                                  setAboutFeatureEditor({
                                    ...aboutFeatureEditor,
                                    value: {
                                      ...aboutFeatureEditor.value,
                                      description: e.target.value,
                                    },
                                  })
                                }
                                rows={3}
                              />
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="outline"
                              className="border-[var(--button-outline-border)]"
                              onClick={() =>
                                setAboutFeatureEditor({ open: false })
                              }
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)]"
                              onClick={() => {
                                const next = [...draft.settings.about.features];
                                next[aboutFeatureEditor.index] =
                                  aboutFeatureEditor.value;
                                setDraft({
                                  ...draft,
                                  settings: {
                                    ...draft.settings,
                                    about: {
                                      ...draft.settings.about,
                                      features: next,
                                    },
                                  },
                                });
                                setAboutFeatureEditor({ open: false });
                              }}
                            >
                              Apply
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      ) : null}
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Testimonials */}
            {activeSection === "testimonials" ? (
              <Card
                id="admin-testimonials"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">
                    Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between gap-3 rounded-md border border-[rgb(var(--renora-accent-rgb)/0.15)] bg-white p-3">
                    <div>
                      <p className="text-sm text-[var(--primary)] font-medium">
                        Hide section
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        If hidden, Testimonials will not appear on the homepage.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Boolean(
                          draft.settings.sections.testimonials.hidden,
                        )}
                        onCheckedChange={(checked) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              sections: {
                                ...draft.settings.sections,
                                testimonials: {
                                  ...draft.settings.sections.testimonials,
                                  hidden: checked,
                                },
                              },
                            },
                          })
                        }
                      />
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {draft.settings.sections.testimonials.hidden
                          ? "Hidden"
                          : "Visible"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[var(--primary)]">Section Heading</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Badge</Label>
                        <Input
                          value={draft.settings.sections.testimonials.badge}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  testimonials: {
                                    ...draft.settings.sections.testimonials,
                                    badge: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={
                            draft.settings.sections.testimonials.badgeStyle
                          }
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  testimonials: {
                                    ...draft.settings.sections.testimonials,
                                    badgeStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={draft.settings.sections.testimonials.title}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  testimonials: {
                                    ...draft.settings.sections.testimonials,
                                    title: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={
                            draft.settings.sections.testimonials.titleStyle
                          }
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  testimonials: {
                                    ...draft.settings.sections.testimonials,
                                    titleStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={draft.settings.sections.testimonials.subtitle}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  testimonials: {
                                    ...draft.settings.sections.testimonials,
                                    subtitle: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Add, edit, delete, or hide testimonials.
                    </p>
                    <Button
                      variant="outline"
                      className="border-[var(--button-outline-border)]"
                      onClick={() => {
                        const next = {
                          id: newId(),
                          name: "New Client",
                          role: "",
                          content: "",
                          rating: 5,
                          hidden: true,
                        };
                        setDraft({
                          ...draft,
                          testimonials: [...draft.testimonials, next],
                        });
                      }}
                    >
                      Add Testimonial
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {draft.testimonials.map((t, idx) => (
                      <Card
                        key={t.id}
                        className="border-[rgb(var(--renora-accent-rgb)/0.15)]"
                      >
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-sm text-[var(--primary)] font-medium">
                              {t.name || "(Unnamed)"}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {t.role ? `${t.role} • ` : ""}Rating: {t.rating}/5
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Label>Active</Label>
                              <Switch
                                checked={!t.hidden}
                                onCheckedChange={(checked) => {
                                  const next = [...draft.testimonials];
                                  next[idx] = {
                                    ...next[idx],
                                    hidden: !checked,
                                  };
                                  setDraft({ ...draft, testimonials: next });
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const value = JSON.parse(
                                    JSON.stringify(draft.testimonials[idx]),
                                  );
                                  setTestimonialEditor({
                                    open: true,
                                    index: idx,
                                    value,
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="border-[var(--button-outline-border)]"
                                onClick={() => {
                                  const next = [...draft.testimonials];
                                  next.splice(idx, 1);
                                  setDraft({ ...draft, testimonials: next });
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Dialog
                    open={testimonialEditor.open}
                    onOpenChange={(open) => {
                      if (!open) setTestimonialEditor({ open: false });
                    }}
                  >
                    {testimonialEditor.open ? (
                      <DialogContent className="sm:max-w-7xl">
                        <DialogHeader>
                          <DialogTitle>Edit Testimonial</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                              value={testimonialEditor.value.name}
                              onChange={(e) =>
                                setTestimonialEditor({
                                  ...testimonialEditor,
                                  value: {
                                    ...testimonialEditor.value,
                                    name: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Input
                              value={testimonialEditor.value.role}
                              onChange={(e) =>
                                setTestimonialEditor({
                                  ...testimonialEditor,
                                  value: {
                                    ...testimonialEditor.value,
                                    role: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Rating (1-5)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              value={testimonialEditor.value.rating}
                              onChange={(e) => {
                                const rating = Number(e.target.value) || 0;
                                setTestimonialEditor({
                                  ...testimonialEditor,
                                  value: {
                                    ...testimonialEditor.value,
                                    rating: Math.max(1, Math.min(5, rating)),
                                  },
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Active</Label>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={!testimonialEditor.value.hidden}
                                onCheckedChange={(checked) =>
                                  setTestimonialEditor({
                                    ...testimonialEditor,
                                    value: {
                                      ...testimonialEditor.value,
                                      hidden: !checked,
                                    },
                                  })
                                }
                              />
                              <span className="text-sm text-[var(--muted-foreground)]">
                                {testimonialEditor.value.hidden
                                  ? "Hidden"
                                  : "Visible"}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Content</Label>
                            <Textarea
                              value={testimonialEditor.value.content}
                              onChange={(e) =>
                                setTestimonialEditor({
                                  ...testimonialEditor,
                                  value: {
                                    ...testimonialEditor.value,
                                    content: e.target.value,
                                  },
                                })
                              }
                              rows={4}
                            />
                            <TextStyleControls
                              style={testimonialEditor.value.contentStyle}
                              onChange={(newStyle) =>
                                setTestimonialEditor({
                                  ...testimonialEditor,
                                  value: {
                                    ...testimonialEditor.value,
                                    contentStyle: newStyle,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            className="border-[var(--button-outline-border)]"
                            onClick={() =>
                              setTestimonialEditor({ open: false })
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)]"
                            onClick={() => {
                              const next = [...draft.testimonials];
                              next[testimonialEditor.index] =
                                testimonialEditor.value;
                              setDraft({ ...draft, testimonials: next });
                              setTestimonialEditor({ open: false });
                            }}
                          >
                            Apply
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    ) : null}
                  </Dialog>
                </CardContent>
              </Card>
            ) : null}

            {/* Contact */}
            {activeSection === "contact" ? (
              <Card
                id="admin-contact"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[var(--primary)]">Section Heading</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Badge</Label>
                        <Input
                          value={draft.settings.sections.contact.badge}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    badge: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={draft.settings.sections.contact.badgeStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    badgeStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={draft.settings.sections.contact.title}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    title: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={draft.settings.sections.contact.titleStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    titleStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={draft.settings.sections.contact.title}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    title: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <TextStyleControls
                          style={draft.settings.sections.contact.titleStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    titleStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={draft.settings.sections.contact.subtitle}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    subtitle: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                          rows={2}
                        />
                        <TextStyleControls
                          style={draft.settings.sections.contact.subtitleStyle}
                          onChange={(newStyle) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                sections: {
                                  ...draft.settings.sections,
                                  contact: {
                                    ...draft.settings.sections.contact,
                                    subtitleStyle: newStyle,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ["Phone", "phone"],
                      ["Phone link (tel:...)", "phoneTel"],
                      ["Email", "email"],
                      ["Email link (mailto:...)", "emailMailto"],
                    ].map(([label, key]) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          value={draft.settings.contact[key]}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              settings: {
                                ...draft.settings,
                                contact: {
                                  ...draft.settings.contact,
                                  [key]: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Input
                        value={draft.settings.contact.address}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              contact: {
                                ...draft.settings.contact,
                                address: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Business Hours</Label>
                      <Input
                        value={draft.settings.contact.hours}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              contact: {
                                ...draft.settings.contact,
                                hours: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Why Choose Title</Label>
                      <Input
                        value={draft.settings.contact.whyChooseTitle}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              contact: {
                                ...draft.settings.contact,
                                whyChooseTitle: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Why Choose Bullets (one per line)</Label>
                      <Textarea
                        value={linesToText(
                          draft.settings.contact.whyChooseBullets,
                        )}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              contact: {
                                ...draft.settings.contact,
                                whyChooseBullets: textToLines(e.target.value),
                              },
                            },
                          })
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Backup */}
            {activeSection === "backup" ? (
              <Card
                id="admin-backup"
                className="border-[rgb(var(--renora-accent-rgb)/0.2)] mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-[var(--primary)]">
                    Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Downloads a ZIP containing the database export under{" "}
                    <b>DB/</b> and all uploaded media under <b>Uploads/</b>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={downloadBackup}
                      disabled={
                        !adminKey.trim() || isBackupLoading || isRestoreLoading
                      }
                      className="bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)]"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isBackupLoading ? "Creating backup..." : "Backup now"}
                    </Button>
                  </div>

                  <div className="pt-3 border-t border-[rgb(var(--renora-accent-rgb)/0.2)] space-y-2">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Restore from a backup ZIP. This will replace the database
                      and overwrite all uploads on the server.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                      <div className="space-y-2">
                        <Label>Restore ZIP</Label>
                        <Input
                          type="file"
                          accept=".zip,application/zip"
                          disabled={
                            !adminKey.trim() ||
                            isBackupLoading ||
                            isRestoreLoading ||
                            isRestoreValidateLoading
                          }
                          onChange={(e) =>
                            setRestoreFile(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[var(--button-outline-border)]"
                          onClick={validateRestoreZip}
                          disabled={
                            !adminKey.trim() ||
                            !restoreFile ||
                            isBackupLoading ||
                            isRestoreLoading ||
                            isRestoreValidateLoading
                          }
                        >
                          {isRestoreValidateLoading
                            ? "Validating..."
                            : "Validate"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[var(--button-outline-border)]"
                          onClick={restoreFromBackup}
                          disabled={
                            !adminKey.trim() ||
                            !restoreFile ||
                            isBackupLoading ||
                            isRestoreLoading ||
                            isRestoreValidateLoading
                          }
                        >
                          {isRestoreLoading ? "Restoring..." : "Restore"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
