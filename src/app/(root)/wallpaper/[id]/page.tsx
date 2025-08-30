import { DownloadIcon, Heart, PlusIcon, ShareIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findWallpaperWithTagsAndUserById } from '@/actions/wallpaper-actions';
import UserItem from '@/components/general/user-item/user-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildImageUrl } from '@/utils/functions';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wallpaper = await findWallpaperWithTagsAndUserById(id)
    .then((res) => res.data)
    .catch(() => notFound());
  console.log(wallpaper);
  if (wallpaper === undefined) {
    return notFound();
  }
  return (
    <>
      <div className='space-y-3 py-6 px-2'>
        <section className='flex items-center justify-between'>
          <Link
            href={`/profile/${wallpaper.user.username}`}
            className='flex items-center gap-x-3'
          >
            <UserItem src={wallpaper.user.imageUrl} alt={wallpaper.title} />
            <div className='space-y-0.5'>
              <p className='text-muted-foreground font-semibold text-sm truncate'>
                {wallpaper.user.username}
              </p>
              <p className='text-xs font-semibold truncate'>
                {wallpaper.title}
              </p>
            </div>
          </Link>
          <div className='flex items-center gap-x-2'>
            <Button size='icon' variant='secondary' aria-label='Like wallpaper'>
              <Heart className='text-foreground' />
            </Button>
            <Button
              size='icon'
              variant='secondary'
              aria-label='Add to collection'
            >
              <PlusIcon className='text-foreground size-5' />
            </Button>
          </div>
        </section>
        <div className='space-y-6'>
          <section
            className='relative'
            style={{
              aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
            }}
          >
            <Image
              className='rounded-xl'
              src={buildImageUrl(wallpaper.fileKey)}
              alt={wallpaper.title}
              fill
              objectFit='cover'
            />
          </section>

          <section className='space-y-3'>
            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-foreground leading-tight'>
                  {wallpaper.title}
                </h1>
                <p className='text-muted-foreground text-sm leading-relaxed font-semibold'>
                  {wallpaper.description}
                </p>
              </div>
              <div className='space-x-2'>
                <Button className='font-semibold'>
                  <ShareIcon />
                  Share
                </Button>
                <Button className='font-semibold'>
                  <DownloadIcon />
                  Download
                </Button>
              </div>
            </div>
            <div>
              <p className='text-muted-foreground text-xs font-semibold'>
                Published on: {wallpaper.createdAt.toDateString()}
              </p>

              <p className='text-muted-foreground text-xs font-semibold'>
                Resolution: {wallpaper.width}x{wallpaper.height}
              </p>
            </div>
          </section>

          {wallpaper.tags && wallpaper.tags.length > 0 && (
            <div className='space-y-3'>
              <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                Tags
              </h3>
              <div className='flex flex-wrap gap-2'>
                {wallpaper.tags.map((tag) => (
                  <div key={tag.tag.id}>{tag.tag.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div></div>
    </>
  );
}
