import { useForm } from 'react-hook-form';
import z from 'zod';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
});

const CreateCollection = () => {
  const {
    register,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>();
  return (
    <Dialog>
      <DialogHeader></DialogHeader>
      <DialogContent>
        <div>
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollection;
