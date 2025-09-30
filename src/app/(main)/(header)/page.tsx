import { TagList } from '@/components/general/tag-list/tag-list';
import { WallpaperListWrapper } from '@/components/general/wallpaper-list/wallpaper-list-wrapper';
import Carousel from '@/components/home/carousel';
import { findAllTagsAction } from '@/server/actions/tag-actions';
import { findAllWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';

export default async function MainPage() {
  const wallpapers = findAllWallpapersWithUserAndLikesAction({
    columns: {
      id: true,
      title: true,
      description: true,
      height: true,
      width: true,
      fileKey: true,
      user: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        imageUrl: true,
      },
      likes: { wallpaperId: true },
    },
    params: {
      limit: 1,
      offset: 0,
    },
  });
  console.log(wallpapers);
  return (
    <div className='mt-4 space-y-4'>
      <section>
        <Carousel className='flex gap-x-2'>
          <TagList className='flex gap-x-2' tags={findAllTagsAction()} />
        </Carousel>
      </section>
      <section>
        <div className='columns-1 gap-x-2 sm:columns-2 md:columns-3 lg:columns-4'>
          <WallpaperListWrapper wallpapers={wallpapers} />
        </div>
      </section>
    </div>
  );
}
