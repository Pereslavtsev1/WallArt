import Link from 'next/link';
import { WallpaperCard, type WallpaperCardProps } from './wallpaper-card';

export function WallpaperList({
  items,
  className,
}: {
  items: WallpaperCardProps[];
  className?: string;
}) {
  return (
    <ul className={className}>
      {items.map((wallpaper) => (
        <li key={wallpaper.id}>
          <Link href={`/wallpaper/${wallpaper.id}`}>
            <WallpaperCard wallpaper={wallpaper} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
