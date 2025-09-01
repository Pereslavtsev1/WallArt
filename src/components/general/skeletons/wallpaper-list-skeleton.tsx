import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const WallpaperListSkeleton = () => {
  return (
    <>
      {[...Array(9)].map((_, index) => (
        <Skeleton
          key={crypto.randomUUID()}
          className={cn('mb-4', index % 2 === 0 ? 'h-60' : 'h-80')}
        />
      ))}
    </>
  );
};
