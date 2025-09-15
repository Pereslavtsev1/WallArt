'use client';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CreateCollectionForm from '@/components/forms/create-collection-form';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useCreateCollectionStore } from '@/stores/create-collection-store';

const CreateCollection = () => {
  const { toggle, open } = useCreateCollectionStore();
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  if (!userId) {
    return redirect('/sign-in');
  }

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className='space-y-2'>
        <div>
          <DialogTitle className='text-lg font-semibold'>Create collection</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground font-semibold'>
            Create a new collection to organize your wallpapers.
          </DialogDescription>
        </div>

        <CreateCollectionForm userId={userId} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollection;
