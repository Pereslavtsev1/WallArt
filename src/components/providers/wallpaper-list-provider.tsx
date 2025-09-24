'use client';
import { createContext, useContext } from 'react';

type WallpaperListStore = {
  className: string;
};
const WallpaperListContext = createContext<WallpaperListStore | undefined>(
  undefined,
);

export function WallpaperListProvider({
  value,
  children,
}: {
  value: WallpaperListStore;
  children: React.ReactNode;
}) {
  return (
    <WallpaperListContext.Provider value={value}>
      {children}
    </WallpaperListContext.Provider>
  );
}

export function useWallpaperList() {
  const context = useContext(WallpaperListContext);
  if (!context)
    throw new Error(
      'useWallpaperList must be used within a WallpaperListProvider',
    );
  return context;
}
