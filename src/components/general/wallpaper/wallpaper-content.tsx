import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import type { Result } from '@/db';
import { Stream, type Streamable } from '../utils/stream';
import type { WallpaperListItem } from '../wallpaper-list/wallpaper-list';

type WallpaperContentProps = {
  data: Streamable<Result<WallpaperListItem | null>>;
};
const WallpaperContent = ({ data }: WallpaperContentProps) => {
  return (
    <Stream value={data} fallback={undefined} errorFallback={undefined}>
      {(data) => {
        if (!data.success) throw new Error(data.error);
        if (data.data === null) notFound();
        const wallpaper = data.data;
        return <Card>{wallpaper.id}</Card>;
      }}
    </Stream>
  );
};

export default WallpaperContent;
