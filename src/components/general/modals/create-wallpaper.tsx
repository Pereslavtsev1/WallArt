'use client';

import CreateWallpaperForm from '@/components/forms/create-wallpaper-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Tag } from '@/db/schema';
import { useUploadWallpaperStore } from '@/stores/upload-wallpaper-store';

const CreateWallpaper = ({ tags }: { tags: Tag[] }) => {
  const { open, toggle } = useUploadWallpaperStore();

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <div>
          <DialogTitle>Upload Wallpaper</DialogTitle>
          <DialogDescription>
            Drag and drop your image here, or click to select a file.
          </DialogDescription>
        </div>

        <CreateWallpaperForm tags={tags} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWallpaper;
