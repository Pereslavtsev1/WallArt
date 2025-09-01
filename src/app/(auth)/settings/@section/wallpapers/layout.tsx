import { findAllTags } from '@/actions/tag-actions';
import WallpaperUpload from '@/components/general/modals/wallpaper-upload';

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tags = await findAllTags();
  return (
    <>
      {children}
      <WallpaperUpload tags={tags} />
    </>
  );
}
