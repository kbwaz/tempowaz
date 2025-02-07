import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutGrid, LayoutList, Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ViewMode = "list" | "grid";

interface ActionBarProps {
  onViewChange?: (mode: ViewMode) => void;
}

const shortcuts = [
  { key: "⌘/Ctrl + N", description: "New todo" },
  { key: "⌘/Ctrl + /", description: "Show shortcuts" },
  { key: "Space", description: "Toggle todo" },
  { key: "Enter", description: "Edit todo" },
  { key: "Delete", description: "Delete todo" },
  { key: "Esc", description: "Cancel editing" },
];

export default function ActionBar({ onViewChange }: ActionBarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    onViewChange?.(mode);
  };

  return (
    <div className="flex h-14 items-center justify-between border-t bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => handleViewChange("list")}
                className="h-8 w-8"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>List view</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => handleViewChange("grid")}
                className="h-8 w-8"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Grid view</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Keyboard className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Keyboard shortcuts</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  {shortcut.key}
                </code>
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
