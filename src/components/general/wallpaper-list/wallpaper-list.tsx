import Link from 'next/link';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import { Stream, type Streamable } from '../utils/stream';
import { WallpaperCard, type WallpaperCardProps } from './wallpaper-card';

export function WallpaperList({
  items,
  className,
}: {
  items: Streamable<WallpaperCardProps[]>;
  className?: string;
}) {
  return (
    <Stream
      value={items}
      fallback={<WallpaperListSkeleton />}
      errorFallback={<div>Error</div>}
    >
      {(data) => (
        <ul className={className}>
          {data.map((wallpaper) => (
            <li key={wallpaper.id}>
              <Link href={`/wallpaper/${wallpaper.id}`}>
                <WallpaperCard wallpaper={wallpaper} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Stream>
  );
}
