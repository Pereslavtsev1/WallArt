"use client";
import { getWallpapers } from "@/app/(root)/server/actions";
import type { Wallpaper } from "@/db/schema";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const WallpaperList = ({
  initinalWallpapers,
  className,
}: {
  initinalWallpapers: Wallpaper[];
  className?: string;
}) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(initinalWallpapers);
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();

  const getAspectRatio = (index: number) => {
    const patterns = [
      "aspect-square",
      "aspect-[2/3]",
      "aspect-[16/9]",
      "aspect-[3/2]",
      "aspect-[4/3]",
    ];
    return patterns[index % patterns.length];
  };
  const loadMoreWallpapers = useCallback(async () => {
    const nextPage = page + 1;
    const newWallpapers = await getWallpapers({ page: nextPage });

    if (newWallpapers.length) {
      setPage(nextPage);
      setWallpapers((prev) => [...prev, ...newWallpapers]);
    }
  }, [page]);

  useEffect(() => {
    if (inView) {
      loadMoreWallpapers();
    }
  }, [inView, loadMoreWallpapers]);

  return (
    <div
      className={`${className} columns-2 gap-2 md:columns-3 md:gap-4 lg:columns-4 lg:gap-6`}
    >
      {wallpapers.map((wallpaper, index) => (
        <div
          key={wallpaper.id}
          className="group relative mb-6 break-inside-avoid overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          <div className={`${getAspectRatio(index)} relative w-full`}>
            <Image
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              fill
              className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute right-4 bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold drop-shadow-lg">
                  {wallpaper.title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
};

export default WallpaperList;
