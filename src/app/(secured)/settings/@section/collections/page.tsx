import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllCollectionsByUserId } from '@/actions/collection-actions';
import CollectionCard from '@/components/settings/sections/collections/collection-card';
import CollectionsList from '@/components/settings/sections/collections/collections-list';
import CreateCollectionButton from '@/components/settings/sections/collections/create-collection-button';
import SettingsSection from '@/components/settings/sections/section';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export default async function Collections() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  console.log(userId);
  const collections = findAllCollectionsByUserId(userId);
  if (collections === undefined) {
    throw new Error('collections undefined');
  }
  return (
    <SettingsSection>
      <SettingsSection.Header className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>Collections</CardTitle>

          <CardDescription>Browse our wallpaper collections</CardDescription>
        </div>
        <CreateCollectionButton />
      </SettingsSection.Header>
      <SettingsSection.Content>
        <div className='grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2'>
          <Suspense fallback={<CollectionSkeletonList />}>
            <CollectionsList promise={collections} />
          </Suspense>
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
}
// TODO: rewrite use skeleton list
const CollectionSkeletonList = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <CollectionCard key={index.toString()}>
          <div className='h-30 space-y-2'>
            <Skeleton className='size-10 rounded-full mb-4' />
            <div className='space-y-2'>
              <Skeleton className='h-5' />

              <Skeleton className='h-10' />
            </div>
          </div>
        </CollectionCard>
      ))}
    </>
  );
};
