import { Skeleton } from '../ui/skeleton';

type WallpaperListSkeletonProps = {
  className?: string;
  length?: number;

  ref?: React.RefObject<HTMLUListElement> | ((node?: Element | null) => void);
};
export default function WallpaperListSkeleton({
  length = 20,
  className,
  ref,
}: WallpaperListSkeletonProps) {
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
}
