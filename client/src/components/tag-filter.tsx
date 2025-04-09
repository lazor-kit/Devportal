import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { availableTags, ProductTag } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";

interface TagFilterProps {
  selectedTags: ProductTag[];
  onTagsChange: (tags: ProductTag[]) => void;
}

const TagFilter = ({ selectedTags, onTagsChange }: TagFilterProps) => {
  const [tempSelectedTags, setTempSelectedTags] = useState<ProductTag[]>(selectedTags);
  const { theme } = useTheme();
  
  const handleTagToggle = (tag: ProductTag) => {
    setTempSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  const applyFilters = () => {
    onTagsChange(tempSelectedTags);
  };
  
  const clearFilters = () => {
    setTempSelectedTags([]);
    onTagsChange([]);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${theme === 'light' ? 'bg-black text-white hover:bg-gray-800 border-black' : ''}`}
        >
          <Filter className="h-4 w-4" />
          Filter by Tags
          {selectedTags.length > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-xs text-white">
              {selectedTags.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-56 p-4 ${theme === 'light' ? 'bg-white' : ''}`}>
        <div className="space-y-2">
          {availableTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox 
                id={`tag-${tag}`} 
                checked={tempSelectedTags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)} 
              />
              <Label htmlFor={`tag-${tag}`} className={`flex-1 text-sm cursor-pointer ${theme === 'light' ? 'text-gray-900' : ''}`}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Label>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between">
          <Button 
            variant="link" 
            className="h-8 px-2 text-sm" 
            onClick={clearFilters}
          >
            Clear All
          </Button>
          <Button 
            size="sm" 
            className="h-8 px-3" 
            onClick={applyFilters}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TagFilter;
