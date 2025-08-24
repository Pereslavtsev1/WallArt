import { EyeIcon, ForwardIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { findWallpaperById } from '@/actions/wallpaper-actions';
import ImageCard from '@/components/general/image-card/image-card';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import type { Wallpaper } from '@/db/schema';
import { useUploadWallpaperStore } from '@/stores/upload-wallpaper-store';
import { buildImageUrl } from '@/utils/functions';
import SettingsSection from './section';

export default function MyWallpaper({ userId }: { userId: string }) {
  const { toggle } = useUploadWallpaperStore();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  useEffect(() => {
    const fetchWallpapers = async () => {
      const data = await findWallpaperById(userId);
      if (data.suscess && data.data) {
        console.log(data.data);
        setWallpapers(data.data);
      }
    };
    fetchWallpapers();
  }, [userId]);
  console.log(wallpapers);
  return (
    <SettingsSection>
      <SettingsSection.Header className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>My wallpaper</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Manage your custom wallpapers.
          </CardDescription>
        </div>
        <Button onClick={() => toggle()}>
          <PlusIcon className='size-4' />
          <span className='hidden font-semibold sm:inline'>Add wallpaper</span>
        </Button>
      </SettingsSection.Header>
      <SettingsSection.Content>
        <div className='grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3'>
          {wallpapers.map((wallpaper) => (
            <ImageCard className='bg-background' key={wallpaper.id}>
              <ImageCard.Image
                src={buildImageUrl(wallpaper.key)}
                alt='Description'
              />
              <ImageCard.Info
                title={wallpaper.title}
                description={wallpaper.description}
              />
              <ImageCard.Actions>
                <Button className='font-semibold'>
                  <EyeIcon className='mt-0.5 size-4' />
                  View
                </Button>
                <Button variant='secondary'>
                  <ForwardIcon />
                  Share
                </Button>
              </ImageCard.Actions>
            </ImageCard>
          ))}
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
}
