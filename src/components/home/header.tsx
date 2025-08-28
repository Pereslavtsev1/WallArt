'use client';
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

const Header = () => {
  const router = useRouter();
  const { isLoaded } = useAuth();

  return (
    <header className='flex h-16 items-center justify-between gap-4 py-4'>
      <div className='flex gap-x-2'>
        <Link href={'/'} className='font-bold text-lg'>
          WallArt
        </Link>
      </div>
      <div className='flex-1 max-w-2xl mx-8'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
          <Input
            type='text'
            placeholder='Search for wallpapers...'
            variant='ghost'
            className='pl-10'
          />
        </div>
      </div>
      <div className='flex h-full'>
        {!isLoaded ? (
          <div className='flex gap-x-2'>
            <Skeleton className='w-20 h-full' />

            <Skeleton className='w-20 h-full' />
          </div>
        ) : (
          <>
            <SignedOut>
              <div className='flex items-center gap-x-2'>
                <Button
                  className='font-semibold'
                  onClick={() => router.push('/sign-up')}
                >
                  Sign up
                </Button>
                <Button
                  className='font-semibold'
                  onClick={() => router.push('/sign-in')}
                >
                  Login
                </Button>
              </div>
            </SignedOut>
            <SignedIn>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => router.push('/settings')}
              >
                <UserItem />
              </Button>
            </SignedIn>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
