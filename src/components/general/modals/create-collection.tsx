import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCollectionStore } from '@/stores/create-collection-store';
import { Button } from '@/components/ui/button';

const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
});

const CreateCollection = () => {
  const { toggle, open } = useCreateCollectionStore();
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>();
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
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
          <Label className='text-sm font-semibold'>Wallpaper Description</Label>
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
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
          <Button variant='outline' className='font-semibold' onClick={toggle}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollection;
