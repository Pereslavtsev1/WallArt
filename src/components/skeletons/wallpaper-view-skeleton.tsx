import { Skeleton } from '@/components/ui/skeleton';

export default function WallpaperViewSkeleton() {
  return (
    <div className='space-y-3 py-6 px-2'>
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-x-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-1'>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-3 w-16' />
          </div>
        </div>
        <div className='flex items-center gap-x-2'>
          <Skeleton className='h-9 w-9 rounded-xl' />
          <Skeleton className='h-9 w-9 rounded-xl' />
        </div>
      </section>

      <div className='space-y-6'>
        <Skeleton className='w-full h-[66vh] rounded-xl mx-auto' />

        <section className='space-y-3'>
          <div className='flex items-start justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-44' />
              <Skeleton className='h-4 w-72' />
            </div>
            <div className='space-x-2 flex'>
              <Skeleton className='h-9 w-24 rounded-xl' />
              <Skeleton className='h-9 w-20 rounded-xl' />
            </div>
          </div>

          <div className='space-y-2'>
            <Skeleton className='h-3 w-40' />
            <Skeleton className='h-3 w-32' />
          </div>
        </section>

        <div className='space-y-3'>
          <Skeleton className='h-3 w-14' />
          <div className='flex gap-2 flex-wrap'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='h-6 w-12 rounded-full' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
