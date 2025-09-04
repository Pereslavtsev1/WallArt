import { findUserWithCollectionsAndWallpaperByUserId } from '@/actions/user-actions';
import ProfileView from '@/components/profile/profile-view';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  const user = findUserWithCollectionsAndWallpaperByUserId(userId);

  return <ProfileView promise={user} />;
}
