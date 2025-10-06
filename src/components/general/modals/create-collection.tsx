'use client';
import CreateCollectionForm from '@/components/forms/create-collection-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateCollectionStore } from '@/stores/create-collection-store';

const CreateCollection = () => {
  const { toggle, open } = useCreateCollectionStore();

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className='space-y-2'>
        <div>
          <DialogTitle className='text-lg font-semibold'>
            Create collection
          </DialogTitle>
          <DialogDescription className='text-sm font-semibold text-muted-foreground'>
            Create a new collection to organize your wallpapers.
          </DialogDescription>
        </div>

        <CreateCollectionForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollection;
