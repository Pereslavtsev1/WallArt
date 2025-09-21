import ProfileView from '@/components/profile/profile-view';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  console.log(userId);
  const user =
    findUserWithCollectionsAndWallpaperByUserId(userId);

  return <ProfileView promise={user} />;
}
