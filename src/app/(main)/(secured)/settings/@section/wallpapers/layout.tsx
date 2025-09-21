import type { ReactNode } from 'react';
import CreateWallpaper from '@/components/general/modals/create-wallpaper';

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <CreateWallpaper />
    </>
  );
}
