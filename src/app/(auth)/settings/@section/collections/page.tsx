import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllCollectionsByUserId } from '@/actions/collection-actions';
import CollectionsList from '@/components/settings/sections/collections-list';
import SettingsSection from '@/components/settings/sections/section';
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
      <SettingsSection.Content>
        <div className='grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2'>
          <Suspense fallback={<div>Loading...</div>}>
            <CollectionsList promise={collections} />
          </Suspense>
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
}
