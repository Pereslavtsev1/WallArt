'use client';

import { useUser } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Logo from '../general/logo';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  return (
    <header className='flex items-center justify-between gap-x-2 py-2'>
      <Link
        href='/'
        className='flex items-center gap-x-2 text-lg font-semibold'
      >
        <Logo />
        <span className='hidden sm:inline'>WallArt</span>
      </Link>
      <div className='w-full max-w-2xl'>
        <div className='relative'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search for wallpapers...'
            variant='ghost'
            className='pl-10 text-xs font-semibold placeholder:text-xs sm:text-sm sm:placeholder:text-sm'
          />
        </div>
      </div>
      <div className='flex items-center justify-end'>
        {!isLoaded ? (
          <Skeleton className='h-9 w-9 rounded-full' />
        ) : !isSignedIn ? (
          <Button
            onClick={() => router.push('/sign-in')}
            variant='default'
            className='h-8.5 w-20'
            asChild
          >
            <span className='font-semibold'>Login</span>
          </Button>
        ) : (
          <Button onClick={() => router.push('/settings/profile')} size='icon'>
            <UserItem src={user.imageUrl} alt={user.firstName?.at(0) || ''} />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
