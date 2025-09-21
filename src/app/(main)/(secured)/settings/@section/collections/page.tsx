import { Suspense } from 'react';
import CollectionCard from '@/components/settings/sections/collections/collection-card';
import CollectionsList from '@/components/settings/sections/collections/collections-list';
import CreateCollectionButton from '@/components/settings/sections/collections/create-collection-button';
import {
  SettingsSection,
  SettingsSectionContent,
  SettingsSectionHeader,
} from '@/components/settings/sections/section';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { findAllCollectionsByUserIdWithCountAction } from '@/server/actions/collection-actions';

export default async function Collections() {
  return (
    <SettingsSection>
      <SettingsSectionHeader className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>Collections</CardTitle>

          <CardDescription>Browse our wallpaper collections</CardDescription>
        </div>
        <CreateCollectionButton />
      </SettingsSectionHeader>
      <SettingsSectionContent>
        <div className='grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2'>
          <Suspense fallback={<CollectionSkeletonList />}>
            <CollectionsList
              promise={findAllCollectionsByUserIdWithCountAction()}
            />
          </Suspense>
        </div>
      </SettingsSectionContent>
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
            <Skeleton className='mb-4 size-10 rounded-full' />
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
