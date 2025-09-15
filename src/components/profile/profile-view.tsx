'use client';
import { FoldersIcon, ImagesIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';
import type { UserWithWallpapersAndCollections } from '@/db/schema';
import { cn } from '@/lib/utils';
import { formantDate } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import { Profile, ProfileContent, ProfileHeader, ProfileTabs } from './profile';

const ProfileView = ({
  promise,
}: {
  promise: Promise<UserWithWallpapersAndCollections | undefined>;
}) => {
  const user = use(promise);
  console.log(user);
  if (!user) notFound();
  const [selectedTab, setSelectedTab] = useState<'wallpapers' | 'collections'>(
    'wallpapers',
  );
  return (
    <Profile className='border-none'>
      <ProfileHeader className='flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 rounded-xl shadow-sm'>
        <UserItem
          src={user.imageUrl}
          alt={user.username}
          className='w-20 h-20 rounded-full'
        />
        <div className='flex flex-col gap-1 text-center sm:text-left'>
          <span className='text-2xl font-bold'>
            {user.firstName} {user.lastName}
          </span>
          <span className='text-sm font-semibold text-muted-foreground'>
            @{user.username}
          </span>
          <span className='text-xs text-muted-foreground font-semibold'>
            Joined {formantDate(user.createdAt)}
          </span>
        </div>
      </ProfileHeader>

      <ProfileTabs className='gap-x-6'>
        <Button
          variant='ghost'
          size='lg'
          className={cn(
            'flex-1 text-center sm:text-left font-semibold',
            selectedTab === 'wallpapers' && 'bg-accent/40',
          )}
          onClick={() => setSelectedTab('wallpapers')}
        >
          <ImagesIcon />
          {`Wallpapers ${user.wallpapers.length}`}
        </Button>
        <Button
          variant='ghost'
          size='lg'
          className={cn(
            'flex-1 text-center sm:text-left font-semibold',
            selectedTab === 'collections' && 'bg-accent/40',
          )}
          onClick={() => setSelectedTab('collections')}
        >
          <FoldersIcon />
          {`Collections ${user.collections.length}`}
        </Button>
      </ProfileTabs>
      <ProfileContent className='mt-6'>
        <div className='columns-1 sm:columns-2 gap-4'>
          {/* TODO: update this */}
          {/* {selectedTab === 'wallpapers' */}
          {/*   ? user.wallpapers.map((wallpaper, index) => ( */}
          {/*       <BlurFade key={wallpaper.id} delay={0.25 + index * 0.05}> */}
          {/*         <WallpaperCard */}
          {/*           wallpaper={{ */}
          {/*             ...wallpaper, */}
          {/*             user: { */}
          {/*               ...user, */}
          {/*             }, */}
          {/*           }} */}
          {/*         /> */}
          {/*       </BlurFade> */}
          {/*     )) */}
          {/*   : user.collections.map((collection) => ( */}
          {/*       <CollectionCard key={collection.id}> */}
          {/*         <CollectionIcon /> */}
          {/**/}
          {/*         <CollectionInfo> */}
          {/*           <CardTitle>{collection.title}</CardTitle> */}
          {/*           <CardDescription className='font-semibold text-xs'> */}
          {/*             {collection.description}{' '} */}
          {/*           </CardDescription> */}
          {/*         </CollectionInfo> */}
          {/*       </CollectionCard> */}
          {/*     ))} */}
        </div>
      </ProfileContent>
    </Profile>
  );
};

export default ProfileView;
