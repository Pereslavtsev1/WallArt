'use client';
import { Button } from '@/components/ui/button';
import { useCreateCollectionStore } from '@/stores/create-collection-store';
import { PlusIcon } from 'lucide-react';

const CreateCollectionButton = () => {
  const { toggle } = useCreateCollectionStore();
  return (
    <Button className='font-semibold' onClick={() => toggle()}>
      <PlusIcon />
      <span className='hidden sm:inline'>Create collection</span>
    </Button>
  );
};

export default CreateCollectionButton;
