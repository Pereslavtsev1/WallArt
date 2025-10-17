'use client';
import { Button } from '@/components/ui/button';
import { useCreateCollectionStore } from '@/stores/create-collection-store';
import { SectionDescription, SectionTitle } from '../section';

export default function CollectionsSectionHeader() {
  const { toggle } = useCreateCollectionStore();
  return (
    <>
      <div className='space-y-1.5'>
        <SectionTitle>Collections</SectionTitle>
        <SectionDescription>
          Browse our wallpaper collections.
        </SectionDescription>
      </div>
      <Button onClick={() => toggle()} className='font-semibold'>
        Add Collections
      </Button>
    </>
  );
}
