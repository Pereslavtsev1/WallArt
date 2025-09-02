import { ForwardIcon } from 'lucide-react';
import DownloadButton from '@/components/general/download-button';
import { Button } from '@/components/ui/button';
import type { Wallpaper } from '@/db/schema';

export default function WallpaperInfo({ wallpaper }: { wallpaper: Wallpaper }) {
  return (
    <section className='space-y-3'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground leading-tight'>
            {wallpaper.title}
          </h1>
          <p className='text-muted-foreground text-sm leading-relaxed font-semibold'>
            {wallpaper.description}
          </p>
        </div>
        <div className='space-x-2'>
          <DownloadButton
            fileKey={wallpaper.fileKey}
            fileName={wallpaper.title}
          />
          <Button variant='secondary' className='font-semibold'>
            <ForwardIcon />
            Share
          </Button>
        </div>
      </div>
    </section>
  );
}
