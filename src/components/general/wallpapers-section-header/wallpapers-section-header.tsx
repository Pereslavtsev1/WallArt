'use client';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateWallpaperStore } from '@/stores/upload-wallpaper-store';

export default function WallpapersSecitonHeader() {
  const { toggle } = useCreateWallpaperStore();
  return (
    <CardHeader className='flex items-center justify-between font-semibold'>
      <div className='space-y-1.5'>
        <CardTitle>My wallpapers</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          Manage your custom wallpapers.
        </CardDescription>
      </div>

      <Button onClick={() => toggle()} className='font-semibold'>
        Add Wallpaper
      </Button>
    </CardHeader>
  );
}
