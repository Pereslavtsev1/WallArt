'use server';
import { Heart, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import UserItem from '@/components/general/user-item/user-item';
import { Button } from '@/components/ui/button';
import type { User } from '@/db/schema';

export default async function WallpaperHeader({ user }: { user: User }) {
  const hasFullName = user.firstName && user.lastName;

  return (
    <section className='flex items-center justify-between'>
      <Link href={`/profile/${user.id}`} className='flex items-center gap-x-3'>
        <UserItem src={user.imageUrl} alt={user.username} />
        <div className='space-y-0.5'>
          <p className='font-semibold text-sm truncate'>
            {hasFullName ? `${user.firstName} ${user.lastName}` : user.username}
          </p>
          {hasFullName && (
            <p className='text-xs text-muted-foreground font-semibold truncate'>
              {user.username}
            </p>
          )}
        </div>
      </Link>
      <div className='flex items-center gap-x-2'>
        <Button size='icon' variant='secondary' aria-label='Like wallpaper'>
          <Heart className='text-foreground' />
        </Button>
        <Button size='icon' variant='secondary' aria-label='Add to collection'>
          <PlusIcon className='text-foreground size-5' />
        </Button>
      </div>
    </section>
  );
}
