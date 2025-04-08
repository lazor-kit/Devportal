import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`px-4 py-2 ${
          viewMode === "grid"
            ? "bg-primary text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => onViewModeChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`px-4 py-2 ${
          viewMode === "list"
            ? "bg-primary text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => onViewModeChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
