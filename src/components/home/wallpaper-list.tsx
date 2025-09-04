'use client';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import type { WallpaperWithUser } from '@/db/schema';
import { BlurFade } from '../magicui/blur-fade';
import WallpaperCard from './wallpaper-card';

const WallpaperList = ({
  promise,
}: {
  promise: Promise<WallpaperWithUser[]>;
}) => {
  const wallpapers = use(promise);
  console.log(wallpapers);
  const router = useRouter();

  return (
    <>
      {wallpapers.map((wallpaper, index) => (
        <BlurFade key={wallpaper.id} delay={0.25 + index * 0.05}>
          <WallpaperCard
            wallpaper={wallpaper}
            onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
          />
        </BlurFade>
      ))}
    </>
  );
};

export default WallpaperList;
