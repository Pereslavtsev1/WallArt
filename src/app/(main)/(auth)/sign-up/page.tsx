'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const schema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),

  username: z.string({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const onSubmit = async (form: FormValues) => {
    await authClient.signUp.email(
      {
        name: form.username,
        password: form.password,
        email: form.email,
        callbackURL: '/',
      },
      {
        onError: (error) => {
          console.error(error.error);
          toast.error(
            error.error.message || 'Something went wrong. Please try again.',
          );
        },

        onSuccess: () => {
          router.push('/');
        },
      },
    );
  };

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <Card className='mx-auto bg-background'>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription className='font-semibold'>
              Welcome! Please fill in the details to get started.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <Button type='button' className='w-full font-semibold'>
                  <Icons.google className='mr-2 size-4' />
                  Continue with Google
                </Button>
                <p className='flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
                  or
                </p>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='example@email.com'
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
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Username</FormLabel>
                      <FormControl>
                        <Input
                          variant='ghost'
                          {...field}
                          className='font-semibold placeholder:font-semibold'
                        />
                      </FormControl>
                      <FormMessage className='text-xs font-semibold' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          variant='ghost'
                          {...field}
                          className='font-semibold placeholder:font-semibold'
                        />
                      </FormControl>
                      <FormMessage className='text-xs font-semibold' />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full font-semibold'
                  disabled={form.formState.isSubmitting}
                >
                  Sign up
                </Button>
                <p className='text-center text-sm font-semibold'>
                  <Link href='/login'>Already have an account? Sign in</Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
