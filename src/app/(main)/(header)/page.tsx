import { TagList } from '@/components/general/tag-list/tag-list';
import InfinityScrollWallpaperList from '@/components/general/wallpaper-list/infinity-scroll-wallpaper-list';
import Carousel from '@/components/home/carousel';
import { findAllTagsAction } from '@/server/actions/tag-actions';
import { findAllWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';

async function fetchFunction({ limit, page }: { limit: number; page: number }) {
  return findAllWallpapersWithUserAndLikesAction({
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
      likes: { wallpaperId: true },
    },
    params: { limit: limit, offset: page * limit },
  });
}
async function loadMore({ limit, page }: { limit: number; page: number }) {
  'use server';
  const res = await fetchFunction({ limit, page });
  if (!res.success) throw new Error(res.error);
  console.log(res.data);
  return res.data;
}

export default async function MainPage() {
  return (
    <div className='mt-4 space-y-4'>
      <section>
        <Carousel className='flex gap-x-2'>
          <TagList className='flex gap-x-2' tags={findAllTagsAction()} />
        </Carousel>
      </section>

      <section>
        <InfinityScrollWallpaperList
          className='columns-1 gap-x-2 md:columns-2 lg:columns-3 xl:columns-4'
          props={{
            loadMoreAction: loadMore,
          }}
        />
      </section>
    </div>
  );
}
