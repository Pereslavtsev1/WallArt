'use client';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadWallpaperStore } from '@/stores/upload-wallpaper-store';

const CreateCollectionButton = () => {
  const { toggle } = useUploadWallpaperStore();
  return (
    <Button className='font-semibold' onClick={() => toggle()}>
      <PlusIcon />
      <span className='hidden sm:inline'>Create collection</span>
    </Button>
  );
};

export default CreateCollectionButton;
