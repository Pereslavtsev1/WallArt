'use client';

import CreateWallpaperForm from '@/components/forms/create-wallpaper-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Result } from '@/db';
import type { Tag } from '@/db/schema';
import { useCreateWallpaperStore } from '@/stores/upload-wallpaper-store';

const CreateWallpaper = ({ tags }: { tags: Promise<Result<Tag[]>> }) => {
  const { open, toggle } = useCreateWallpaperStore();
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Wallpaper</DialogTitle>
          <DialogDescription className='font-semibold'>
            Drag and drop your image here, or click to select a file.
          </DialogDescription>
        </DialogHeader>
        <CreateWallpaperForm promise={tags} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWallpaper;
