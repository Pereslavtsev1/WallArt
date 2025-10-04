'use client';
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
          <WallpaperCard {...wallpaper} />
        </li>
      ))}
    </ul>
  );
}
