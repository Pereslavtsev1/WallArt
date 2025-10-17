import CreateWallpaper from '@/components/general/modals/create-wallpaper';
import { UserWallpapersProvider } from '@/components/providers/user-wallpapers';
import { findAllTagsAction } from '@/server/actions/tag-actions';

export default async function WallpapersSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserWallpapersProvider>
      {children}
      <CreateWallpaper tags={findAllTagsAction()} />
    </UserWallpapersProvider>
  );
}
