'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const schema = z.object({
  description: z.string().optional(),
  firstName: z
    .string()
    .min(1, { message: 'First name must be at least 1 character' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
});

const ProfileForm = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>First name</FormLabel>
              <FormControl>
                <Input
                  placeholder=''
                  {...field}
                  variant='ghost'
                  className='font-semibold placeholder:font-semibold'
                />
              </FormControl>
              <FormMessage className='text-xs font-semibold' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Last name</FormLabel>
              <FormControl>
                <Input
                  placeholder=''
                  {...field}
                  variant='ghost'
                  className='font-semibold placeholder:font-semibold'
                />
              </FormControl>
              <FormMessage className='text-xs font-semibold' />
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
                  placeholder=''
                  {...field}
                  variant='ghost'
                  rows={6}
                  className='resize-none bg-background font-semibold placeholder:font-semibold'
                />
              </FormControl>
              <FormMessage className='text-xs font-semibold' />
            </FormItem>
          )}
        />
        <div className='flex w-full justify-end'>
          <Button type='submit' className='font-semibold'>
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
