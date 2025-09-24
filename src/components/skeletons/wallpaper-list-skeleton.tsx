import { Skeleton } from '../ui/skeleton';

const WallpaperListSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <ul className='flex w-full gap-x-2'>
      {Array.from({ length }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={index}>
          <Skeleton className={'h-72 w-full'} />
        </li>
      ))}
    </ul>
  );
};

export default WallpaperListSkeleton;
