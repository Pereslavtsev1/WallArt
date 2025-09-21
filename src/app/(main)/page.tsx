import TagList from '@/components/general/tag-list/tag-list';
import WallpaperList from '@/components/general/wallpaper-list/wallpaper-list';
import Carousel from '@/components/home/carousel';
import { finAllTagsAction } from '@/server/actions/tag-actions';
import { findAllWallpapersWithUserAction } from '@/server/actions/wallpaper-actions';

const MainPage = () => {
  const wallpapers = findAllWallpapersWithUserAction({
    limit: 10,
    offset: 0,
  });
  return (
    <>
      <section>
        <Carousel className='flex gap-x-2'>
          <TagList className='flex gap-x-2' tags={finAllTagsAction()} />
        </Carousel>
      </section>
      <WallpaperList className={''} wallpapers={wallpapers} />
    </>
  );
};

export default MainPage;
