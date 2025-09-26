import { DownloadIcon, HeartIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import UserItem from '@/components/general/user-item/user-item';
import { Stream } from '@/components/general/utils/stream';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { findWallpaperWithUserAndLikesByIdAction } from '@/server/actions/wallpaper-actions';
import { buildImageUrl } from '@/utils/functions';
import WallpaperActions from '@/components/general/wallpaper/wallpaper-actions';

const WallpaperPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const wallpaper = findWallpaperWithUserAndLikesByIdAction(
    {
      id: true,
      title: true,
      description: true,
      height: true,
      width: true,
      fileKey: true,
      user: {
        firstName: true,
        lastName: true,
        username: true,
        imageUrl: true,
      },
      likes: { wallpaperId: true },
    },
    id,
  );
  return (
    <div className='mx-auto max-w-7xl'>
      <section>
        <Stream
          value={wallpaper}
          fallback={undefined}
          errorFallback={undefined}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);
            if (data.data === null) notFound();
            const wallpaper = data.data;
            console.log('server');
            return (
              <Card className='border-none bg-background px-0'>
                <CardHeader className='flex items-center justify-between px-0'>
                  <div className='flex items-center gap-x-2'>
                    <UserItem
                      src={wallpaper.user.imageUrl}
                      alt={wallpaper.user.username}
                    />
                    <div className='flex flex-col font-semibold'>
                      <span className='text-sm'>
                        {wallpaper.user.firstName} {wallpaper.user.lastName}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {wallpaper.user.username}
                      </span>
                    </div>
                  </div>
                  <div className='flex gap-x-2'>
                    <Button size='icon' variant='secondary'>
                      <HeartIcon />
                    </Button>
                    <Button size='icon' variant='secondary'>
                      <PlusIcon className='size-4.5' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='px-0'>
                  <Image
                    src={buildImageUrl(wallpaper.fileKey)}
                    alt={wallpaper.title}
                    height={wallpaper.height}
                    width={wallpaper.width}
                    className='rounded-2xl object-cover'
                  />
                </CardContent>
                <CardFooter className='flex items-start justify-between px-0'>
                  <div className='font-semibold'>
                    <CardTitle className='text-sm'>{wallpaper.title}</CardTitle>
                    <CardDescription className='text-xs'>
                      {wallpaper.description}
                    </CardDescription>
                  </div>
                  <div>
                    <Button className='font-semibold'>
                      <DownloadIcon />
                      <span className='hidden sm:inline'>Download</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          }}
        </Stream>
      </section>
    </div>
  );
};

export default WallpaperPage;
