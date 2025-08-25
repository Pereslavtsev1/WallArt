'use client';
import { useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { createCollection } from '@/actions/collection-actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCollectionStore } from '@/stores/create-collection-store';

const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
});

const CreateCollection = () => {
  const { toggle, open } = useCreateCollectionStore();
  const { userId } = useAuth();
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<z.infer<typeof schema>>();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!userId) {
      toast.error('Authentication Required', {
        description: 'You must be logged in to upload a wallpaper.',
      });
      return;
    }
    try {
      const response = await createCollection({
        userId: userId,
        title: data.title,
        description: data.description,
      });
      if (response.success) {
        console.log(response.data);
        toast.success('Collection created successfully');
      } else {
        throw new Error('Collection creation failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Collection creation failed');
        console.error(error.message);
      }
    } finally {
      reset();
      clearErrors();
      toggle();
    }
  };
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <DialogTitle className='text-lg font-semibold'>
              Create collection
            </DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground font-semibold'>
              Create a new collection to organize your wallpapers.
            </DialogDescription>
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label className='text-sm font-semibold'>Title</Label>
            <Input
              variant='ghost'
              {...register('title')}
              className='text-sm font-semibold'
            />
            {errors.title && (
              <p className='text-xs font-semibold text-red-500'>
                {errors.title.message}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label className='text-sm font-semibold'>
              Wallpaper Description
            </Label>
            <Textarea
              placeholder='Enter your message'
              {...register('description')}
              variant='ghost'
              rows={4}
              className='resize-none text-sm font-semibold placeholder:font-semibold'
            />
          </div>
          <DialogFooter className='flex flex-row justify-end'>
            <Button type='submit' className='font-semibold'>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant='outline'
              className='font-semibold'
              onClick={toggle}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollection;
