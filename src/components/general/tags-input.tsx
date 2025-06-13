"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Tag } from "@/db/schema";
import { Check, X } from "lucide-react";
import { useRef, useState } from "react";

interface TagsInputProps {
  tags: Tag[];
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  onBlur?: () => void;
  name?: string;
}
const TagsInput = ({
  value: selectedTags,
  onChange: setSelectedTags,
  tags,
  onBlur,
}: TagsInputProps) => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  );

  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagToRemove.id));
  };

  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);

    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const isTagSelected = (tag: Tag) => {
    return selectedTags.some((t) => t.id === tag.id);
  };

  return (
    <div className="w-full rounded-md border border-input text-sm transition-colors hover:border-ring focus:border-ring">
      <div className="px-3 py-2">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="flex cursor-pointer items-center gap-1 text-xs font-semibold hover:bg-secondary/80"
                onClick={(e) => {
                  e.stopPropagation();

                  removeTag(tag);
                }}
              >
                {tag.name}
                <X className="h-4 w-4" />
              </Badge>
            ))}
          </div>
        )}

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className="flex cursor-pointer items-center justify-between"
              onBlur={onBlur}
            >
              {selectedTags.length === 0 && (
                <p className="text-sm font-medium text-muted-foreground">
                  Add tags for wallpaper
                </p>
              )}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-0">
            <div className="p-2">
              <Input
                ref={inputRef}
                placeholder="Search tags..."
                variant="ghost"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            <div className="max-h-48 overflow-y-auto p-1">
              {filteredTags.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {search ? "No tags found" : "No tags available"}
                </div>
              ) : (
                filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => toggleTag(tag)}
                  >
                    <span className="font-medium">{tag.name}</span>

                    {isTagSelected(tag) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TagsInput;
