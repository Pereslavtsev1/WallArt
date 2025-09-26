import { Skeleton } from '../ui/skeleton';

type WallpaperListSkeletonProps = {
  className?: string;
  length?: number;
  ref?: any;
};
const WallpaperListSkeleton = ({
  length = 10,
  className,
  ref,
}: WallpaperListSkeletonProps) => {
  return (
    <ul className={className} ref={ref}>
      {Array.from({ length }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={index}>
          <Skeleton className={'h-72 mb-2 break-inside-avoid'} />
        </li>
      ))}
    </ul>
  );
};

export default WallpaperListSkeleton;
