import CreateWallpaper from '@/components/general/modals/create-wallpaper';
import { findAllTagsAction } from '@/server/actions/tag-actions';

export default async function WallpapersSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CreateWallpaper tags={findAllTagsAction()} />
    </>
  );
}
