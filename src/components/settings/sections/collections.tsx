'use client';

import { PlusIcon } from 'lucide-react';
import { Suspense } from 'react';
import { findAllCollectionsByUserId } from '@/actions/collection-actions';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { useCreateCollectionStore } from '@/stores/create-collection-store';
import { CollectionsList } from './a';
import SettingsSection from './section';

const Collections = ({ userId }: { userId: string }) => {
  const { toggle } = useCreateCollectionStore();
  return (
    <SettingsSection>
      <SettingsSection.Header className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>Collections</CardTitle>
          <CardDescription>Browse our wallpaper collections</CardDescription>
        </div>
        <Button onClick={toggle}>
          <PlusIcon />
          <span className='hidden sm:inline font-semibold'>Add collection</span>
        </Button>
      </SettingsSection.Header>
      <SettingsSection.Content>
        <Suspense fallback={<div>Loading...</div>}>
          <CollectionsList promise={findAllCollectionsByUserId(userId)} />
        </Suspense>
      </SettingsSection.Content>
    </SettingsSection>
  );
};

export default Collections;
