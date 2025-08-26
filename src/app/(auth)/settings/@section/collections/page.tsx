import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllCollectionsByUserId } from '@/actions/collection-actions';
import CollectionsList from '@/components/settings/sections/collections-list';
import SettingsSection from '@/components/settings/sections/section';
export default async function Collections() {
  const { userId } = await auth();
  if (!userId) {
    return;
  }
  const collections = findAllCollectionsByUserId(userId);
  console.log(userId);

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
