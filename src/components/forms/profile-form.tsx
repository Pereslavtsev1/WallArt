import { UserResource } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const schema = z.object({
  description: z.string().optional(),
  firstName: z.string().min(1, { message: 'First name must be at least 1 character' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
});

const ProfileForm = ({ user }: { user: UserResource }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      description: (user.unsafeMetadata.description as string) ?? '',
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await user.update({
        firstName: data.firstName,
        lastName: data.lastName,
        unsafeMetadata: {
          description: data.description,
        },
      });
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

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
              <FormMessage className='font-semibold text-xs' />
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
                  placeholder=''
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
          <Button type='submit' className='font-semibold'>
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
