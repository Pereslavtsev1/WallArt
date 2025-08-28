'use client';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadWallpaperStore } from '@/stores/upload-wallpaper-store';

const AddWallpaperButton = () => {
  const { toggle } = useUploadWallpaperStore();
  return (
    <Button className='font-semibold' onClick={() => toggle()}>
      <PlusIcon />
      <span className='hidden sm:inline'>Add wallpaper</span>
    </Button>
  );
};

export default AddWallpaperButton;
