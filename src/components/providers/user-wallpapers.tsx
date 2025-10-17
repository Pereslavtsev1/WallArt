'use client';
import { createContext, type ReactNode, useContext } from 'react';
import type { WallpaperCardProps } from '@/components/general/wallpaper-list/wallpaper-card';
import {
  type UseInfinityScrollReturn,
  useInfinityScroll,
} from '@/hooks/use-infinity-scroll';
import { findAllCurrentUserWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';

type UserWallpapersContextProps = {} & UseInfinityScrollReturn<
  WallpaperCardProps[]
>;

const UserWallpapersContext = createContext<
  UserWallpapersContextProps | undefined
>(undefined);

export const UserWallpapersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const value = useInfinityScroll<WallpaperCardProps[]>({
    loadMoreAction: async ({ page, limit }) => {
      const res = await findAllCurrentUserWallpapersWithUserAndLikesAction({
        columns: {
          id: true,
          title: true,
          description: true,
          height: true,
          width: true,
          fileKey: true,
          user: { id: true, username: true, image: true },
          likes: { wallpaperId: true },
        },
        params: { limit, offset: limit * page },
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  return (
    <UserWallpapersContext.Provider value={value}>
      {children}
    </UserWallpapersContext.Provider>
  );
};

export const useUserWallpapers = () => {
  const context = useContext(UserWallpapersContext);
  if (!context) {
    throw new Error(
      'useUserWallpapers must be used within a UserWallpapersProvider',
    );
  }
  return context;
};
