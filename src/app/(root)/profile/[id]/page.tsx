import { findUserWithCollectionsAndWallpaperByUserId } from '@/actions/user-actions';
import UserItem from '@/components/general/user-item/user-item';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await findUserWithCollectionsAndWallpaperByUserId(id);
  console.log(user);
  if (!user) notFound();
  return (
    <Card className='bg-background'>
      <CardHeader className='flex-row items-center gap-4 flex gap-x-2'>
        <UserItem className='size-20' src={user.imageUrl} alt={user.username} />
        <div>
          <h1 className='font-semibold'>{user.username}</h1>
        </div>
      </CardHeader>
      <CardDescription>{user.username}</CardDescription>
    </Card>
  );
}
