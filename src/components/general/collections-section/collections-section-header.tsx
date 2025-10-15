'use client';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCollectionStore } from '@/stores/create-collection-store';

export default function CollectionsSectionHeader() {
  const { toggle } = useCreateCollectionStore();
  return (
    <CardHeader className='flex items-center justify-between font-semibold'>
      <div className='space-y-1.5'>
        <CardTitle>Collections</CardTitle>
        <CardDescription>Browse our wallpaper collections.</CardDescription>
      </div>

      <Button onClick={() => toggle()} className='font-semibold'>
        Add Collections
      </Button>
    </CardHeader>
  );
}
