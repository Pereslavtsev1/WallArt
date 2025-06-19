"use client";

import { getWallpapers } from "@/app/server/actions";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [ref, inView] = useInView();

  const loadMoreWallpapers = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const newWallpapers = await getWallpapers({ page: nextPage });

    if (newWallpapers.length) {
      setPage(nextPage);
      setWallpapers((prev) => [...prev, ...newWallpapers]);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    if (inView) {
      loadMoreWallpapers();
    }
  }, [inView, loadMoreWallpapers]);

  return (
    <div
      className={`${className} grid grid-flow-dense auto-rows-[250px] grid-cols-1 gap-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
    >
      {wallpapers.map((wallpaper, index) => {
        const rowSpan = index % 3 === 0 ? 1 : 2;
        return (
          <div
            key={wallpaper.id}
            className={`group row-span-${rowSpan} relative flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <Image
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              fill
              className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-lg font-semibold text-white drop-shadow">
                {wallpaper.title}
              </span>
            </div>
          </div>
        );
      })}
      {hasMore && <div ref={ref} />}
    </div>
  );
};

export default WallpaperList;
