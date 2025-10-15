'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import Logo from '../general/logo';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

export default function Header() {
  const { data, isPending } = useSession();

  console.log('Data');
  console.log(data);

  return (
    <header className='flex items-center justify-between gap-x-2 py-2'>
      <Link
        href='/'
        className='flex items-center gap-x-2 text-lg font-semibold'
      >
        <div className='px-2'>
          <Logo />
        </div>
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
        {isPending && <Skeleton className='size-9 rounded-full' />}
        {!isPending && data && (
          <Link href={'/settings/profile'}>
            <UserItem src={data.user.image ?? ''} alt={data.user.name} />
          </Link>
        )}
        {!isPending && !data && (
          <Link href={'/login'}>
            <Button variant='ghost' className='px-2 font-semibold md:px-4'>
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
