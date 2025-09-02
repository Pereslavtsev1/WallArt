import { Skeleton } from '@/components/ui/skeleton';

export default function WallpaperTagsSkeleton() {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-3 w-14' />
      <div className='flex gap-2 flex-wrap'>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className='h-6 w-12 rounded-full' />
        ))}
      </div>
    </div>
  );
}
