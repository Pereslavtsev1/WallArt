'use client';

import { useUser } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Logo from '../general/logo';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

const Header = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <header className='py-2 flex items-center justify-between gap-x-2'>
      <Link href='/' className='font-semibold text-lg flex items-center gap-x-2'>
        <Logo />
        <span className='hidden sm:inline'>WallArt</span>
      </Link>
      <div className='max-w-2xl w-full'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
          <Input
            type='text'
            placeholder='Search for wallpapers...'
            variant='ghost'
            className='pl-10 placeholder:text-xs text-xs sm:placeholder:text-sm sm:text-sm font-semibold'
          />
        </div>
      </div>
      <div className='justify-end flex items-center'>
        {!isLoaded ? (
          <Skeleton className='h-9 w-9 rounded-full' />
        ) : !isSignedIn ? (
          <Link href='/sign-in'>
            <Button variant='default' className='h-8.5 w-20' asChild>
              <span className='font-semibold'>Login</span>
            </Button>
          </Link>
        ) : (
          <Link href={'/settings/profile'}>
            <UserItem src={user.imageUrl} alt={''} className='size-9' />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
