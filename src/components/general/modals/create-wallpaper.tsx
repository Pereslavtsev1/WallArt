'use client';

import { use } from 'react';
import CreateWallpaperForm from '@/components/forms/create-wallpaper-form';
import { useTagsPromise } from '@/components/providers/tags-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUploadWallpaperStore } from '@/stores/upload-wallpaper-store';

const CreateWallpaper = () => {
  const { open, toggle } = useUploadWallpaperStore();
  const res = use(useTagsPromise());
  if (!res.success) throw new Error(res.error);
  const tags = res.data;

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <div>
          <DialogTitle>Upload Wallpaper</DialogTitle>
          <DialogDescription>
            Drag and drop your image here, or click to
            select a file.
          </DialogDescription>
        </div>

        <CreateWallpaperForm tags={tags} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWallpaper;
