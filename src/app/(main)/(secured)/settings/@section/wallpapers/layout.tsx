import type { ReactNode } from 'react';
import { findAllTags } from '@/actions/tag-actions';
import CreateWallpaper from '@/components/general/modals/create-wallpaper';

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const tags = await findAllTags();
  return (
    <>
      {children}
      <CreateWallpaper tags={tags} />
    </>
  );
}
