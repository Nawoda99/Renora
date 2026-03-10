import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

async function fetchJson(input, init) {
  const response = await fetch(input, init);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return await response.json();
}

export function MediaLibraryPanel({
  active = true,
  adminKey,
  onSelect,
  autoSelectOnUpload = false,
  onAfterSelect,
  enableManage = false,
  mobileSingleColumn = false,
  dialogMode = false,
  onRenamed,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameFrom, setRenameFrom] = useState(null);
  const [renameTo, setRenameTo] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteName, setDeleteName] = useState(null);

  const sortedItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = query
      ? items.filter((i) => i.name.toLowerCase().includes(query))
      : items;
    return [...base].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
  }, [items, search]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson("/api/media");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!active) return;
    void refresh();
  }, [active]);

  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const result = await fetchJson("/api/media", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
        body: form,
      });

      await refresh();

      if (autoSelectOnUpload && result.url && onSelect) {
        onSelect(result.url);
        onAfterSelect?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const renameFile = async (from, to) => {
    setUploading(true);
    setError(null);
    try {
      const result = await fetchJson("/api/media/rename", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({ from, to }),
      });

      if (result?.ok) {
        onRenamed?.({
          from: result.from,
          to: result.to,
          fromUrl: result.fromUrl,
          toUrl: result.toUrl,
          updatedReferences: result.updatedReferences,
        });
      }
      await refresh();
      setRenameOpen(false);
      setRenameFrom(null);
      setRenameTo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rename failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (name) => {
    setUploading(true);
    setError(null);
    try {
      const response = await fetch(`/api/media/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed: ${response.status}`);
      }
      await refresh();
      setDeleteOpen(false);
      setDeleteName(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  const controls = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <Input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          void uploadFile(file);
          e.currentTarget.value = "";
        }}
      />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by filename"
        disabled={loading || uploading}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => void refresh()}
        disabled={loading || uploading}
      >
        Refresh
      </Button>
    </div>
  );

  const grid = (
    <div
      className={
        (mobileSingleColumn
          ? "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4") + " gap-3"
      }
    >
      {sortedItems.map((item) => {
        const isSelectable = typeof onSelect === "function";
        const content = (
          <>
            <div className="aspect-[4/3] bg-muted">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                loading="lazy"
              />
            </div>
            <div className="p-2">
              <p className="text-xs text-foreground truncate">{item.name}</p>
              {enableManage ? (
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRenameFrom(item.name);
                      setRenameTo(item.name);
                      setRenameOpen(true);
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={uploading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteName(item.name);
                      setDeleteOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          </>
        );

        if (isSelectable) {
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                onSelect?.(item.url);
                onAfterSelect?.();
              }}
              className="group rounded-md border border-border overflow-hidden bg-card text-left"
              title={item.name}
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={item.name}
            className="group rounded-md border border-border overflow-hidden bg-card text-left"
            title={item.name}
          >
            {content}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={
        dialogMode ? "flex flex-col min-h-0 h-full w-full" : "space-y-4"
      }
    >
      {dialogMode ? (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="sticky top-0 z-10 bg-background pb-4">
            {controls}
            {error ? (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            ) : null}
            {loading ? (
              <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
            ) : null}
          </div>

          <div className="space-y-4">
            {grid}
            {sortedItems.length === 0 && !loading ? (
              <p className="text-sm text-muted-foreground">
                No uploads yet. Upload an image to get started.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {controls}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : null}
          {grid}
          {sortedItems.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground">
              No uploads yet. Upload an image to get started.
            </p>
          ) : null}
        </>
      )}

      <Dialog
        open={renameOpen}
        onOpenChange={(open) => {
          setRenameOpen(open);
          if (!open) {
            setRenameFrom(null);
            setRenameTo("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rename file</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enter a new filename (letters, numbers, dot, underscore, dash).
            </p>
            <Input
              value={renameTo}
              onChange={(e) => setRenameTo(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!renameFrom) return;
                void renameFile(renameFrom, renameTo);
              }}
              disabled={uploading || !renameFrom || !renameTo.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteName(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file from the server. Any
              sections using this image will break until you pick another image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={uploading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteName) return;
                void deleteFile(deleteName);
              }}
              disabled={uploading || !deleteName}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
