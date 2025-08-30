'use client';

import { useUser } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import Link from 'next/link';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Logo } from './logo';

const Header = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <header className='py-2 flex items-center justify-between'>
      <Link href='/' className='font-semibold text-lg'>
        WallArt
      </Link>
      <div className='max-w-2xl mx-8 w-full'>
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
      <div className='w-20 justify-end flex'>
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
            <Button size='icon' variant='ghost' asChild>
              <UserItem
                src={user.imageUrl}
                alt={user.username || 'User Profile'}
              />
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
