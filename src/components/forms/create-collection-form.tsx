import { createCollection } from '@/actions/collection-actions';
import { useCreateCollectionStore } from '@/stores/create-collection-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
});
const CreateCollectionForm = ({ userId }: { userId: string }) => {
  const { toggle } = useCreateCollectionStore();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const onSubmit = async (data: z.infer<typeof schema>) => {
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
      toggle();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter collection title'
                  {...field}
                  variant='ghost'
                  className='font-semibold placeholder:font-semibold'
                />
              </FormControl>
              <FormMessage className='font-semibold text-xs' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter collection description'
                  {...field}
                  variant='ghost'
                  rows={6}
                  className='resize-none font-semibold placeholder:font-semibold'
                />
              </FormControl>
              <FormMessage className='font-semibold text-xs' />
            </FormItem>
          )}
        />
        <div className='w-full flex justify-end'>
          <Button type='submit' className='font-semibold' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating Collection...' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCollectionForm;
