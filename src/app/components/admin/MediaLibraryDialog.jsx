import { MediaLibraryPanel } from "./MediaLibraryPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function MediaLibraryDialog({
  open,
  onOpenChange,
  adminKey,
  onSelect,
  autoSelectOnUpload = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl h-[80vh] min-h-0 overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 flex">
          <MediaLibraryPanel
            active={open}
            adminKey={adminKey}
            dialogMode
            onSelect={(url) => {
              onSelect(url);
              onOpenChange(false);
            }}
            autoSelectOnUpload={autoSelectOnUpload}
            onAfterSelect={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
