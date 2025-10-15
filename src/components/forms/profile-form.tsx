'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { User } from '@/db/schema';
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
  username: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
});
export type ProofileFromProps = {
  user: Pick<User, 'name' | 'description' | 'image'>;
};
const ProfileForm = ({ user }: ProofileFromProps) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: user.description || '',
      username: user.name,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
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
