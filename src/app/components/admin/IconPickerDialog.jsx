import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { ALL_ICON_KEYS, iconComponentFromKey } from "../../content/iconMap";

export function IconPickerDialog({
  open,
  onOpenChange,
  title = "Choose an icon",
  value,
  onSelect,
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ICON_KEYS;
    return ALL_ICON_KEYS.filter((k) => k.toLowerCase().includes(q));
  }, [query]);

  const ActiveIcon = value ? iconComponentFromKey(value) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              className="border-[rgb(var(--cios-accent-rgb)/0.3)] focus:border-[rgb(var(--cios-accent-rgb))]"
            />
            <div className="shrink-0 text-sm text-muted-foreground">
              {filtered.length} icons
            </div>
          </div>

          {value ? (
            <div className="flex items-center gap-2 text-sm text-[#6D4C41]">
              <span>Selected:</span>
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1">
                {ActiveIcon ? (
                  <ActiveIcon className="h-4 w-4" aria-hidden />
                ) : null}
                <span className="font-mono text-xs">{value}</span>
              </span>
            </div>
          ) : null}

          <ScrollArea className="h-[60vh] rounded-md border border-[rgb(var(--cios-accent-rgb)/0.2)] bg-white">
            <div className="p-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {filtered.map((k) => {
                  const Icon = iconComponentFromKey(k);
                  const selected = value === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        onSelect(k);
                        onOpenChange(false);
                      }}
                      className={
                        "group flex flex-col items-center justify-center gap-1 rounded-md border bg-card p-2 text-center hover:bg-[rgb(var(--cios-accent-rgb)/0.08)] " +
                        (selected
                          ? "border-[rgb(var(--cios-accent-rgb)/0.6)]"
                          : "border-border")
                      }
                      title={k}
                    >
                      {Icon ? (
                        <Icon
                          className={
                            "h-5 w-5 " +
                            (selected
                              ? "text-[rgb(var(--cios-accent-rgb))]"
                              : "text-foreground")
                          }
                          aria-hidden
                        />
                      ) : (
                        <div className="h-5 w-5" />
                      )}
                      <span className="w-full truncate text-[10px] text-muted-foreground group-hover:text-foreground">
                        {k}
                      </span>
                    </button>
                  );
                })}
              </div>

              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No icons match your search.
                </p>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
