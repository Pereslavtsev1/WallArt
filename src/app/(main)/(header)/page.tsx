'use server';

import { TagList } from '@/components/general/tag-list/tag-list';
import InfinityScrollWallpaperList from '@/components/general/wallpaper-list/infinity-scroll-wallpaper-list';
import Carousel from '@/components/home/carousel';
import { findAllTagsAction } from '@/server/actions/tag-actions';
import { findAllWallpapersWithUserAndLikesStatusAction } from '@/server/actions/wallpaper-actions';

async function loadMoreAction({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  'use server';

  const res = await findAllWallpapersWithUserAndLikesStatusAction({
    columns: {
      id: true,
      title: true,
      description: true,
      height: true,
      width: true,
      fileKey: true,
      user: {
        id: true,
        username: true,
        image: true,
      },
    },
    params: { limit: limit, offset: page * limit },
  });
  console.log('server');

  if (!res.success) throw new Error(res.error);
  return res.data;
}

export default async function MainPage() {
  const tags = await findAllTagsAction();

  return (
    <div className='mt-4 space-y-4'>
      <section>
        <Carousel className='flex gap-x-2'>
          <TagList className='flex gap-x-2' tags={tags} />
        </Carousel>
      </section>

      <InfinityScrollWallpaperList
        loadMoreAction={loadMoreAction}
        className='columns-1 gap-x-2 sm:columns-2 lg:columns-3 xl:columns-4'
      />
    </div>
  );
}
