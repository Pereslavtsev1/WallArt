import { Skeleton } from '../ui/skeleton';

export default function DeviceListSkeleton() {
  return (
    <div className='space-y-2'>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
            className='flex w-full items-center justify-between rounded-lg border px-4 py-2.5'
          >
            <div className='w-full space-y-2 pr-18'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-3 w-2/3' />
            </div>
            <Skeleton className='h-8 w-8 rounded-md' />
          </div>
        ))}
    </div>
  );
}
